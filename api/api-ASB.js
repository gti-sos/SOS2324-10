const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const API_BASE = "/api/v1"
app.use(bodyParser.json());
const datos = require('../index-ASB');


module.exports = (app) => {
    app.get(API_BASE + "/datosasb", (req, res) => {
        res.send(JSON.stringify(datos));
    });
    app.get(API_BASE + "/datosasb/loadInitialdatos", (req, res) => {
        if(datos == null){
            res.send(JSON.stringify(datos));
        }
    });
    // app.post(API_BASE + "/datosasb", (req, res) => {
    //     if (datos.some(entry => entry.id === req.body.id)) {
    //         res.status(409).send("Conflict: Resource already exists");
    //     } else {
    //         // El recurso no existe, agregarlo a csv
    //         datos.push(req.body);
    //         res.status(201).send("Created");
    //     }
    // });
    
    app.post(API_BASE + "/datosasc", (req, res) => {
        let datos = req.body;
    
        // Verificar si el body es un JSON válido y tiene la estructura esperada
        const structure = {
            'id':'number',
            'datosflow': 'string',
            'last_update': 'isoDate',
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
    
        const actualKeys = Object.keys(datos);
        const expectedKeys = Object.keys(structure);
        const isValidJson = expectedKeys.every(key => actualKeys.includes(key) && typeof datos[key] === structure[key]);
    
        if (!isValidJson || actualKeys.length !== expectedKeys.length) {
            // El JSON no tiene la estructura esperada
            res.status(400).send("Bad Request: JSON has invalid structure");
        } else if (datos.some(entry => entry.id === datos.id)) {
            // El recurso ya existe, devolver error 409
            res.status(409).send("Conflict: Resource already exists");
        } else {
            // El recurso no existe, agregarlo a csv
            data.push(datos);
            res.status(201).send("Created");
        }
    });
};  