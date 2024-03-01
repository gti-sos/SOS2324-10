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
    app.get(API_BASE + "/datosasb/loadInitialData", (req, res) => {
        if(datos == null){
            res.send(JSON.stringify(datos));
        }
    });
    app.post(API_BASE + "/datosasb", (req, res) => {
        if (datos.some(entry => entry.id === req.body.id)) {
            res.status(409).send("Conflict: Resource already exists");
        } else {
            // El recurso no existe, agregarlo a csv
            datos.push(req.body);
            res.status(201).send("Created");
        }
    });
};