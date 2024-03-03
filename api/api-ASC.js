const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const API_BASE = "/api/v1";
const csv = require('../index-ASC');
app.use(bodyParser.json());


module.exports = (app) => {
    app.get(API_BASE + "/datosasc", (req, res) => {
        res.send(JSON.stringify(csv));
    });

    app.get(API_BASE + "/datosasc/loadInitialData", (req, res) => {
        if (csv == null) {
            res.send(JSON.stringify(csv));
        }
    });

    app.post(API_BASE + "/datosasc", (req, res) => {
        let growth = req.body;
    
        // Verificar si el body es un JSON válido y tiene la estructura esperada
        const expectedStructure = {
            id: Number,
            frequency: String,
            unit: String,
            age: String,
            geo: String,
            time_period: Number,
            obs_value: Number,
            gdp: Number,
            volgdp: Number
        };
    
        const actualKeys = Object.keys(growth);
        const expectedKeys = Object.keys(expectedStructure);
        const isValidJson = expectedKeys.every(key => actualKeys.includes(key) && typeof growth[key] === expectedStructure[key]);
    
        if (!isValidJson || actualKeys.length !== expectedKeys.length) {
            // El JSON no tiene la estructura esperada
            res.status(400).send("Bad Request: JSON has invalid structure");
        } else if (csv.some(entry => entry.id === growth.id)) {
            // El recurso ya existe, devolver error 409
            res.status(409).send("Conflict: Resource already exists");
        } else {
            // El recurso no existe, agregarlo a csv
            csv.push(growth);
            res.status(201).send("Created");
        }
    });

    app.put(API_BASE + "/datosasc/:id", (req, res) => {
        const id = req.params.id;
        const newData = req.body;

        // Verificar si el dato tiene el mismo id del recurso en la URL
        if (id !== newData.id) {
            res.status(400).send("Bad Request: ID mismatch");
        } else {
            // Actualizar el recurso si existe, de lo contrario, devolver error 404
            const index = csv.findIndex(entry => entry.id === id);
            if (index !== -1) {
                csv[index] = newData;
                res.status(200).send("Updated");
            } else {
                res.status(404).send("Not Found");
            }
        }
    });

    app.delete(API_BASE + "/datosasc", (req, res) => {
        csv.splice(0, csv.length);
        res.sendStatus(200, "Deleted all -> Datos ASC");
    });

    // Manejar todos los otros métodos no permitidos
    app.all(API_BASE + "/datosasc", (req, res) => {
        res.sendStatus(405);
    });

    // Manejar todos los otros accesos a rutas inexistentes
    //app.use((req, res, next) => {
    //    res.status(404).send("Not Found");
    //});

    // Middleware para manejar errores
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Internal Server Error');
    });
};
