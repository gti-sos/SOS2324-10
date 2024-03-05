const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const API_BASE = "/api/v1";
app.use(bodyParser.json());
const datos_TLR = require('./../index-TLR');




// API Tomás
module.exports = (app, db_TLR) => {

  
  app.get(API_BASE + "/vehicles-stock/loadInitialData", (req, res) => {
    // Comprobar si la base de datos está vacía
    db_TLR.find({}, (err, data) => {
      if (err) {
        res.sendStatus(500, "Internal Error");
      }
      if (data.length === 0) {
        // Insertar los datos iniciales solo si la base de datos está vacía
        db_TLR.insert(initial_datos_TLR, (err, newDocs) => {
          if (err) {
            res.sendStatus(500, "Internal Error");
          }
          res.sendStatus(200, "OK");
        });
      } else {

        res.sendStatus(200, "OK");
      }
    });
  });

  //Método GET Persistente

  //GET datos completo
  app.get(API_BASE + "/vehicles-stock/", (req, res) => {
    db_TLR.find({}, (error, datos) => {
      if (error) {
        res.sendStatus(500, "Internal Error")
      } else {
        res.send(JSON.stringify(datos))
      }
    });
  });

  //Función GET con filtro
  app.get(API_BASE + "/vehicles-stock/search", (req, res) => {
    const queryParams = req.query;
    const filteredData = datos_TLR.filter(vehicle => {
      for (const key in queryParams) {
        if (vehicle[key] !== queryParams[key]) {
          return false;
        }
      }
      return true;
    });

    if (filteredData.length === 0) {
      return res.status(404, "Not Found");
    }

    res.status(200).send(filteredData);
  });



  //Método POST Persistente con ID
  app.post(API_BASE + "/vehicles-stock/:id", (req, res) => {
    const id = req.params.id;
    if (id) {
      return res.sendStatus(405, "Bad Request");
    }
  });

  //Método POST Persistente sin ID
  app.post(API_BASE + "/vehicles-stock", (req, res) => {

    const expectedFields = ["freq", "vehicle", "unit", "geo", "time_period", "obs_value", "flights_passangers", "cars_deaths"];
    const receivedFields = Object.keys(req.body);
    const unexpectedFields = receivedFields.filter(field => !expectedFields.includes(field));

    // Verificar si se recibieron campos adicionales no esperados
    if (unexpectedFields.length > 0) {
      res.sendStatus(400, "Bad Request");
    }

    // Verificar si se recibió un objeto con ID en el cuerpo de la solicitud
    /**if ('id' in req.body) {
      // Verificar si el ID recibido es válido
      const idFromBody = parseInt(req.body.id);
      if (isNaN(idFromBody) || idFromBody < 0) {
        res.sendStatus(400, "Bad Request");
      }
      // Verificar si el ID ya existe en la base de datos
      db_TLR.findOne({ id: idFromBody }, (err, existingVehicle) => {
        if (err) {
          res.sendStatus(500, "Internal Error");
        }
        if (existingVehicle) {
          res.sendStatus(409, "Conflict");
        }
        // Si el ID es válido y no existe, agregar el vehículo a la base de datos
        req.body.id = idFromBody.toString(); // Convertir el ID a una cadena de texto
        db_TLR.insert(req.body, (err, newVehicle) => {
          if (err) {
            res.sendStatus(500, "Internal Error");
          }
          res.status(201, "OK").send(newVehicle);
        });
      });
    } else */{
      // Si no se proporciona un ID en el cuerpo de la solicitud, generar uno nuevo
      db_TLR.find({}).sort({ id: -1 }).limit(1).exec((err, lastVehicle) => {
        if (err) {
          res.sendStatus(500, "Internal Error");
        }
        const lastId = lastVehicle.length > 0 ? parseInt(lastVehicle[0].id) : 0;
        req.body.id = (lastId + 1).toString(); // Asignar un nuevo ID al vehículo
        // Insertar el nuevo vehículo en la base de datos
        db_TLR.insert(req.body, (err, newVehicle) => {
          if (err) {
            res.sendStatus(500, "Internal Error");
          }
          res.status(201).send(newVehicle);
        });
      });
    }
  });




  //Método PUT
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

  //DELETE Persistente
  app.delete(API_BASE + "/vehicles-stock/:id", (req, res) => {
    let id = parseInt(req.params.id);
    // Si no se añade id en la URL se borrarán todas las entradas
    if (!id) {
      // Eliminar todas las entradas de la base de datos
      db_TLR.remove({}, { multi: true }, (err, numRemoved) => {
        if (err) {
          res.sendStatus(500, "Internal Error");
        }
        res.sendStatus(200, "OK");
      });
    } else {
      // Verificar si el ID es válido
      if (isNaN(id) || id < 0) {
        res.sendStatus(400, "Bad Request");
      }

      // Eliminar el vehículo por ID de la base de datos
      db_TLR.remove({ "id": id }, {}, (err, numRemoved) => {
        if (err) {
          res.sendStatus(500, "Internal Error");
        } else {
          if (numRemoved >= 1) {
            res.sendStatus(200, "OK");
          } else {
            res.sendStatus(404, "Not Found");
          }
        }
      });
    }
  });

  let initial_datos_TLR = [
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




}

