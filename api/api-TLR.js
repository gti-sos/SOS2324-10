const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const API_BASE = "/api/v1";
app.use(bodyParser.json());
const datos_TLR = require('./../index-TLR');


// API Tomás

module.exports = (app) => {
    app.get(API_BASE + "/vehicles-stock/loadInitialData", (req, res) => {
        if (datos_TLR.length === 0) {
            for (let i = 0; i < backup_datos_TLR.length; i++) {
                datos_TLR.push(backup_datos_TLR[i]);
            }
            res.sendStatus(201, "CREATED");
        } else {
            res.send(`<html><body><h1>Ya hay datos cargados</h1></body></html>`);
        }
    });

    app.get(API_BASE + "/vehicles-stock", (req, res) => {
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

let backup_datos_TLR = [
    {
      id: 1,
      freq: 'A',
      vehicle: 'BUS_TOT',
      unit: 'NR',
      geo: 'Albania',
      time_period: 2017,
      obs_value: 6583,
      flights_passangers: 18336,
      cars_deaths: 1079
    },
    {
      id: 2,
      freq: 'A',
      vehicle: 'BUS_TOT',
      unit: 'NR',
      geo: 'Albania',
      time_period: 2021,
      obs_value: 7867,
      flights_passangers: 26258,
      cars_deaths: 976
    },
    {
      id: 3,
      freq: 'A',
      vehicle: 'BUS_TOT',
      unit: 'NR',
      geo: 'Austria',
      time_period: 1990,
      obs_value: 9400,
      flights_passangers: 25762,
      cars_deaths: 958
    },
    {
      id: 4,
      freq: 'A',
      vehicle: 'BUS_TOT',
      unit: 'NR',
      geo: 'Austria',
      time_period: 1991,
      obs_value: 9400,
      flights_passangers: 23582,
      cars_deaths: 956
    },
    {
      id: 5,
      freq: 'A',
      vehicle: 'BUS_TOT',
      unit: 'NR',
      geo: 'Austria',
      time_period: 1992,
      obs_value: 9900,
      flights_passangers: 24887,
      cars_deaths: 931
    },
    {
      id: 6,
      freq: 'A',
      vehicle: 'BUS_TOT',
      unit: 'NR',
      geo: 'España',
      time_period: 2003,
      obs_value: 56000,
      flights_passangers: 24580,
      cars_deaths: 878
    },
    {
      id: 7,
      freq: 'A',
      vehicle: 'BUS_TOT',
      unit: 'NR',
      geo: 'España',
      time_period: 2004,
      obs_value: 57000,
      flights_passangers: 23372,
      cars_deaths: 768
    },
    {
      id: 8,
      freq: 'A',
      vehicle: 'BUS_TOT',
      unit: 'NR',
      geo: 'España',
      time_period: 2005,
      obs_value: 58200,
      flights_passangers: 24235,
      cars_deaths: 730
    },
    {
      id: 9,
      freq: 'A',
      vehicle: 'BUS_TOT',
      unit: 'NR',
      geo: 'España',
      time_period: 2006,
      obs_value: 60400,
      flights_passangers: 26353,
      cars_deaths: 691
    },
    {
      id: 10,
      freq: 'A',
      vehicle: 'BUS_TOT',
      unit: 'NR',
      geo: 'España',
      time_period: 2007,
      obs_value: 61000,
      flights_passangers: 22210,
      cars_deaths: 679
    },
    {
      id: 11,
      freq: 'A',
      vehicle: 'BUS_TOT',
      unit: 'NR',
      geo: 'Bélgica',
      time_period: 2008,
      obs_value: 16000,
      flights_passangers: 19744,
      cars_deaths: 633
    },
    {
      id: 12,
      freq: 'A',
      vehicle: 'BUS_TOT',
      unit: 'NR',
      geo: 'Bélgica',
      time_period: 2009,
      obs_value: 16100,
      flights_passangers: 17677,
      cars_deaths: 552
    },
    {
      id: 13,
      freq: 'A',
      vehicle: 'BUS_TOT',
      unit: 'NR',
      geo: 'Bélgica',
      time_period: 2010,
      obs_value: 16200,
      flights_passangers: 17055,
      cars_deaths: 523
    },
    {
      id: 14,
      freq: 'A',
      vehicle: 'BUS_TOT',
      unit: 'NR',
      geo: 'Bélgica',
      time_period: 2011,
      obs_value: 16100,
      flights_passangers: 14031,
      cars_deaths: 531
    },
    {
      id: 15,
      freq: 'A',
      vehicle: 'BUS_TOT',
      unit: 'NR',
      geo: 'Bélgica',
      time_period: 2012,
      obs_value: 16000,
      flights_passangers: 13733,
      cars_deaths: 455
    },
    {
      id: 16,
      freq: 'A',
      vehicle: 'BUS_TOT',
      unit: 'NR',
      geo: 'Bélgica',
      time_period: 2013,
      obs_value: 15800,
      flights_passangers: 13115,
      cars_deaths: 430
    },
    {
      id: 17,
      freq: 'A',
      vehicle: 'BUS_TOT',
      unit: 'NR',
      geo: 'Bulgaria',
      time_period: 2012,
      obs_value: 23000,
      flights_passangers: 12675,
      cars_deaths: 479
    },
    {
      id: 18,
      freq: 'A',
      vehicle: 'BUS_TOT',
      unit: 'NR',
      geo: 'Bulgaria',
      time_period: 2013,
      obs_value: 23300,
      flights_passangers: 11562,
      cars_deaths: 432
    },
    {
      id: 19,
      freq: 'A',
      vehicle: 'BUS_TOT',
      unit: 'NR',
      geo: 'Bulgaria',
      time_period: 2014,
      obs_value: 23603,
      flights_passangers: 10777,
      cars_deaths: 414
    },
    {
      id: 20,
      freq: 'A',
      vehicle: 'BUS_TOT',
      unit: 'NR',
      geo: 'Bulgaria',
      time_period: 2015,
      obs_value: 24010,
      flights_passangers: 10119,
      cars_deaths: 409
    },
    {
      id: 21,
      freq: 'A',
      vehicle: 'BUS_TOT',
      unit: 'NR',
      geo: 'Bulgaria',
      time_period: 2016,
      obs_value: 23359,
      flights_passangers: 8537,
      cars_deaths: 416
    },
    {
      id: 22,
      freq: 'A',
      vehicle: 'BUS_TOT',
      unit: 'NR',
      geo: 'Bulgaria',
      time_period: 2017,
      obs_value: 21020,
      flights_passangers: 7837,
      cars_deaths: 344
    },
    {
      id: 23,
      freq: 'A',
      vehicle: 'BUS_TOT',
      unit: 'NR',
      geo: 'Bulgaria',
      time_period: 2018,
      obs_value: 20818,
      flights_passangers: 9246,
      cars_deaths: 362
    },
    {
      id: 24,
      freq: 'A',
      vehicle: 'BUS_TOT',
      unit: 'NR',
      geo: 'Bulgaria',
      time_period: 2019,
      obs_value: 20687,
      flights_passangers: 9026,
      cars_deaths: 370
    },
    {
      id: 25,
      freq: 'A',
      vehicle: 'TRC',
      unit: 'NR',
      geo: 'Bélgica',
      time_period: 2014,
      obs_value: 44693,
      flights_passangers: 2532,
      cars_deaths: 1397
    }
  
  ]






