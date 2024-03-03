const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const API_BASE = "/api/v1";
const csv = require('../index-ASC');
app.use(bodyParser.json());


module.exports = (app) => {

    // ------------ GET -------------

    app.get(API_BASE + "/tourisms-per-age", (req, res) => {
        res.send(JSON.stringify(csv));
    });

    app.get(API_BASE + "/tourisms-per-age/loadInitialData", (req, res) => {
        if (csv == null) {
            res.send(JSON.stringify(csv));
        }
    });

    app.get(API_BASE + "/tourisms-per-age/:age", (req, res) => {
        const edad = req.params.age;
        const restr = csv.filter(n => n.age === edad);

        if (restr.length > 0) {
            res.send(JSON.stringify(restr));
            res.sendStatus(200, "OK");
        } else {
            res.sendStatus(404, "NOT FOUND");
        }

    });
    // ------------ POST --------------

    app.post(API_BASE + "/tourisms-per-age", (req, res) => {
        let growth = req.body;
    
        // Verificar si el body es un JSON válido y tiene la estructura esperada
        const expectedStructure = {
            'id': 'number',
            'frequency': 'string',
            'unit': 'string',
            'age': 'string',
            'geo': 'string',
            'time_period': 'number',
            'obs_value': 'number',
            'gdp': 'number',
            'volgdp': 'number'
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


    // ---------------- PUT ------------------

    app.put(API_BASE + "tourisms-per-age/:geo", (req, res) => {

        const pais = req.params.geo;
        let data = req.body;
        const filtro = csv.findIndex(dato => dato.geo === pais);

        if (filtro.length === 0) {
            res.sendStatus(404, "NOT FOUND");
        } else {
            for (let i = 0; i < csv.length; i++) {
                if (csv[i].geo === pais) {
                    csv[i] = data;
                }
            }
            res.sendStatus(200, "OK");
        }
    });

    // -------------- DEL -----------------

    app.delete(API_BASE + "/tourisms-per-age", (req, res) => {
        csv.splice(0, csv.length);
        res.sendStatus(200, "Deleted all -> Datos ASC");
    });

    app.delete(API_BASE + "/tourisms-per-age/:age", (req, res) => {
        const edad = req.params.age;
        const restr = csv.filter(n => n.age === edad);

        if (restr.length > 0) {
            res.send(JSON.stringify(restr));
            res.sendStatus(200, "OK");
        } else {
            res.sendStatus(404, "NOT FOUND");
        }

    });

    // Manejar todos los otros métodos no permitidos
    app.all(API_BASE + "/tourisms-per-age/*", (req, res) => {
        res.sendStatus(405);
    });

    // Manejar todos los otros accesos a rutas inexistentes
    /**app.use((req, res, next) => {
        res.status(404).send("Not Found");
    });*/
    //app.use((req, res, next) => {
    //    res.status(404).send("Not Found");
    //});

    // Middleware para manejar errores
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Internal Server Error');
    });
};
