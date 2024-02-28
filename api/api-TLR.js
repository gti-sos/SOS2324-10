const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const API_BASE = "/api/v1";
app.use(bodyParser.json());
const datos_TLR = require('./../index-TLR');
// API Tomás

module.exports = (app) => {
    app.get(API_BASE + "/vehicles-stock", (req, res) => {
        res.send(`<html><body><h1>https://data.europa.eu/data/datasets/nhmove15jqyapyxty0rpjw?locale=es</h1></body></html>`);
    });

    app.get(API_BASE + "/vehicles-stock/loadInitialData", (req, res) => {
        res.send(JSON.stringify(datos_TLR));

    });

    /**app.post(API_BASE + "/vehicles-stock", (req, res) => {
        let new_entry = req.body;

        const exists = datos_TLR.some(vehicle => 
            vehicle.geo === new_entry.geo && vehicle.time_period === new_entry.time_period
        );
        if (exists) {
            res.sendStatus(409, "Ya está esta entrada en la base de datos");
        } else {
            datos_TLR.push(new_entry);
            res.sendStatus(201);
        }
    });*/
    app.post(API_BASE + "/vehicles-stock", (req, res) => {
        const newVehicle = req.body;

        // Verificar si el objeto enviado tiene un ID duplicado en datos_TLR
        const duplicateId = datos_TLR.some(vehicle => vehicle.id === newVehicle.id);
        if (duplicateId) {
            // Si hay un ID duplicado, devolver un código de estado 409 (conflicto)
            return res.sendStatus(409).send("Ya existe una entrada con ese id");
        }

        // Si el objeto no tiene un ID o tiene un ID único, agregarlo a datos_TLR
        if (!newVehicle.id) {
            // Si el objeto no tiene un ID, asignarle uno que sea +1 que el de la última entrada
            if (datos_TLR.length === 0) {
                newVehicle.id = 1; // Si no hay entradas en datos_TLR, asignar ID 1
            } else {
                // Obtener el ID de la última entrada y asignarle +1
                const lastId = datos_TLR[datos_TLR.length - 1].id;
                newVehicle.id = parseInt(lastId) + 1;
            }
        }

        // Agregar el nuevo vehículo al array datos_TLR
        datos_TLR.push(newVehicle);

        // Enviar una respuesta con el vehículo agregado
        res.status(201).send("created");
    });


    app.delete(API_BASE + "/vehicles-stock", (req, res) => {
        // Lógica para eliminar los datos_TLR, por ejemplo:
        datos_TLR.splice(0, datos_TLR.length); // Elimina todos los elementos del array
        res.status(200).send({ message: `Deleted all vehicles-stock` });
    });
};



