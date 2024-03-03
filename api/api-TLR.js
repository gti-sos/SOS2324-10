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
        const idToFind = req.query.id;

        if (idToFind) { // Si se recibe un id, devolver dicho elemento. Sino devolver todos.
            // Verificar si el ID es válido
            if (isNaN(parseInt(idToFind)) || parseInt(idToFind) < 0) {
                return res.sendStatus(400).send({ message: "Bad Request" });
            }
            const vehicle = datos_TLR.find(vehicle => vehicle.id === parseInt(idToFind));

            // Verificar si el elemento existe
            if (!vehicle) {
                return res.sendStatus(404).send({ message: "Not Found" });
            }
            return res.status(200).send(vehicle);

        } else { //Si no se intruce id, devolvemos todos los datos
            return res.status(200).send(datos_TLR);
        }
    });

    app.post(API_BASE + "/vehicles-stock", (req, res) => {
        // Verificamos que no exista id en la URL
        if (req.query.id) {
            return res.sendStatus(405);
        }


        const expectedFields = ["freq", "vehicle", "unit", "geo", "time_period", "obs_value", "flights_passangers", "cars_deaths"];
        const receivedFields = Object.keys(req.body);
        const unexpectedFields = receivedFields.filter(field => !expectedFields.includes(field));

        // Verificar si se recibieron campos adicionales no esperados
        if (unexpectedFields.length > 0) {
            return res.sendStatus(400);
        }

        if ('id' in req.body) {//Verificamos si recibimos id y lo validamos
            const idFromBody = parseInt(req.body.id);
            if (!isNaN(idFromBody)) {
                if (idFromBody < 0) {
                    return res.sendStatus(400);
                }
                const existingVehicle = datos_TLR.find(vehicle => vehicle.id === idFromBody);
                if (existingVehicle) {
                    return res.sendStatus(409);
                }
            } else {
                return res.sendStatus(400);
            }
        } else {//Si no recibimos id, añadir uno
            const lastId = datos_TLR.length > 0 ? parseInt(datos_TLR[datos_TLR.length - 1].id) : 0;
            req.body.id = (lastId + 1).toString(); 
        }

        // Construimos la nueva entrada
        const newVehicle = {};
        for (const field of expectedFields) {
            if (req.body.hasOwnProperty(field)) {
                newVehicle[field] = req.body[field];
            } else {
                return res.sendStatus(400);
            }
        }
        datos_TLR.push(newVehicle);
        res.status(201).send(newVehicle);
    });





    app.put(API_BASE + "/vehicles-stock", (req, res) => {
        let idURL = req.query.id;
        let idBody = req.body.id;
        let updatedVehicle = req.body;
        //Verificamos que exista el parámtro id en la URL
        if (!idURL) {
            return res.sendStatus(405).send({ message: "Introduce un ID" });
        }

        // Verificamos si el ID de la URL es válido
        if (isNaN(parseInt(idURL)) || parseInt(idURL) < 0) {
            return res.sendStatus(400);
        }

        // Verificamos si el ID del body es válido
        if (isNaN(parseInt(idBody)) || parseInt(idBody) < 0) {
            return res.sendStatus(400);
        }

        //Verificamos que coincidan ambos id
        if (idBody && parseInt(idBody) !== parseInt(idURL)) {
            return res.sendStatus(400).send({ message: "No modifiques el id pillín" });
        }
        const indexToUpdate = datos_TLR.findIndex(vehicle => vehicle.id === parseInt(idURL));

        const expectedFields = ["id", "freq", "vehicle", "unit", "geo", "time_period", "obs_value", "flights_passangers", "cars_deaths"];
        const receivedFields = Object.keys(req.body);
        const unexpectedFields = receivedFields.filter(field => !expectedFields.includes(field));

        // Verificar si se recibieron campos adicionales no esperados
        if (unexpectedFields.length > 0) {
            // Si se recibieron campos adicionales no esperados, devolver un código de estado 400 (solicitud incorrecta)
            return res.sendStatus(400);
        }

        // Verificar si el elemento existe
        if (indexToUpdate === -1) {
            return res.sendStatus(404).send({ message: "Elemento no encontrado" });
        }
        datos_TLR[indexToUpdate] = updatedVehicle;
        return res.sendStatus(200).send({ message: "Elemento modificado" });

    });


    app.delete(API_BASE + "/vehicles-stock", (req, res) => {
        // Si no se añade id en la URL se borrarán todas las entradas
        if (!req.query.id) {
            datos_TLR.splice(0, datos_TLR.length);
            return res.status(200).send({ message: "Entradas eliminadas correctamente" });
        }

        // Si se añade id en la URL se borrará dicha entrada
        const idToDelete = req.query.id;
        // Verificar si el ID es válido 
        if (isNaN(parseInt(idToDelete)) || parseInt(idToDelete) < 0) {
            return res.sendStatus(400).send({ message: "Inserte un id válido, únicamente valores numéricos" });
        }
        const indexToDelete = datos_TLR.findIndex(vehicle => vehicle.id === parseInt(idToDelete));

        //Error si no existe dicho index
        if (indexToDelete === -1) {
            return res.sendStatus(404).send({ message: "Elemento no encontrado" });
        }
        // Eliminar el elemento 
        datos_TLR.splice(indexToDelete, 1);
        res.status(200).send({ message: `Elemento con ID ${idToDelete} eliminado correctamente.` });
    });

};








