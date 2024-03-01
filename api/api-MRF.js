const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const API_BASE = "/api/v1"
app.use(bodyParser.json());
const datos_MRF = require('./../index-MRF');

//API Miguel
module.exports = (app) => {
    app.get(API_BASE + "/gdp-growth-rates", (req, res) => {
        res.send(`<html><body><h1>https://data.europa.eu/data/datasets/1pdehxmf8q9yexgyf1pyhq?locale=en, https://data.europa.eu/data/datasets/jrc-luisa-lf113-b-gdp-capita-ref-2014?locale=en</h1></body></html>`);
    });
    
    app.get(API_BASE + "/gdp-growth-rates/loadInitialData", (req, res) => {
        if(datos_MRF == null){
            res.send(JSON.stringify(datos_MRF));
        }
    });
    
    app.post(API_BASE + "/gdp-growth-rates", (req, res) => {
        let growth = req.body;
        datos_MRF.push(growth);
        res.sendStatus(201, "Created");
    });
    
    app.delete(API_BASE + "/gdp-growth-rates", (req, res) => {
        datos_MRF.splice(0, datos_MRF.length); 
        res.sendStatus(200,"Deleted all -> GDP Growth rates");
    });

    app.post(API_BASE + "/gdp-growth-rates", (req, res) => {
        const newGDP = req.body;
        //Verificamos que no exista un elemento con el mismo id
        const duplicateId = datos_MRF.some(gdp => gdp.id === newGDP.id);
        if (duplicateId) {
            //Si hay elemento con mismo id, devolver error
            return res.sendStatus(409).send("Ya existe una entrada con ese id");
        }
        //Función para agragar id si no tiene
        if (!newGDP.id) {
            if (datos_MRF.length === 0) {
                newGDP.id = 1; 
            } else {
                const lastId = datos_MRF[datos_MRF.length - 1].id;
                newGDP.id = parseInt(lastId) + 1;
            }
        }
        datos_MRF.push(newGDP);
        //Mensaje de 201 OK
        res.status(201).send("created");
    });
    
};




