const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const API_BASE = "/api/v1"
app.use(bodyParser.json());
const datos = require('../index-ASB');


module.exports = (app) => {
    //GET
    app.get(API_BASE + "/cars-by-motor", (req, res) => {
        res.send(JSON.stringify(datos));
    });
    app.get(API_BASE + "/cars-by-motor/loadInitialdatos", (req, res) => {
        if(datos == null){
            res.send(JSON.stringify(datos));
        }
    });
    app.get(API_BASE + "/cars-by-motor/:geo", (req, res) => {
        const pais = req.params.geo;
        const restr = datos.filter(n => n.geo === pais);

        if (restr.length > 0) {
            res.send(JSON.stringify(restr));
            res.sendStatus(200, "OK");
        } else {
            res.sendStatus(404, "NOT FOUND");
        }

    });
    //POST
    app.post(API_BASE + "/cars-by-motor", (req, res) => {
        let data = req.body;
    
        // Verificar si el body es un JSON válido y tiene la estructura esperada
        const structure = {
            'id':'number',
            'dataflow': 'string',
            'last_update': 'string',
            'freq': 'string',
            'unit': 'string',
            'mot_nrg': 'string',
            'geo': 'string',
            'time_period': 'number',
            'obs_value': 'number',
            'obs_flag': 'string',
            'millions_of_passenger_per_kilometres': 'number',
            'road_deaths_per_million_inhabitants': 'number'
        };
    
        const actualKeys = Object.keys(data);
        const expectedKeys = Object.keys(structure);
        const isValidJson = expectedKeys.every(key => actualKeys.includes(key) && typeof data[key] === structure[key]);
    
        if (!isValidJson || actualKeys.length !== expectedKeys.length) {
            // El JSON no tiene la estructura esperada
            res.status(400).send("Bad Request: JSON has invalid structure");
        } else if (datos.some(entry => entry.id === data.id)) {
            // El recurso ya existe, devolver error 409
            res.status(409).send("Conflict: Resource already exists");
        } else {
            // El recurso no existe, agregarlo a csv
            datos.push(datos);
            res.status(201).send("Created");
        }
    });
    //PUT
    app.put(API_BASE + "/cars-by-motor/:id", (req, res) => {
        const id = req.params.id;
        const newData = req.body;

        // Verificar si el dato tiene el mismo id del recurso en la URL
        if (id !== newData.id) {
            res.status(400).send("Bad Request: ID mismatch");
        } else {
            // Actualizar el recurso si existe, de lo contrario, devolver error 404
            const index = datos.findIndex(entry => entry.id === id);
            if (index !== -1) {
                datos[index] = newData;
                res.status(200).send("Updated");
            } else {
                res.status(404).send("Not Found");
            }
        }
    });
    //DELETE
    app.delete(API_BASE + "/b", (req, res) => {
        datos.splice(0, datos.length);
        res.sendStatus(200, "Deleted all -> Datos ASB");
    });
    // Manejar todos los otros métodos no permitidos
    app.all(API_BASE + "/cars-by-motor/*", (req, res) => {
        res.sendStatus(405);
    });

};  