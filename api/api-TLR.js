const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const API_BASE = "/api/v1";
app.use(bodyParser.json());
const datos_TLR = require('./../index-TLR');




// API Tomás
module.exports = (app, db_TLR) => {


  app.get('/api/v1/vehicles-stock/docs', (req, res) => {
    const documentationURL = 'https://warped-trinity-19905.postman.co/workspace/SOS2324-10~6041b4cf-1144-4aa6-8878-7c39fb610ff4/collection/19421857-1c44b0e3-ad2a-4b9a-af45-798fd5948246?action=share&creator=19421857&active-environment=19421857-89973f15-31e4-4340-9e61-c116d427406e'; // Reemplaza esto con la URL de tu documentación

    // Redirigir al portal de documentación
    res.redirect(documentationURL);
  });


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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    db_TLR.find({}, { _id: 0, id: 0 })
      .sort({ id: 1 }) // Ordenar por ID
      .skip(skip) // Saltar los documentos anteriores según la página actual
      .limit(limit) // Limitar el número de documentos devueltos
      .exec((error, datos) => {
        if (error) {
          res.sendStatus(500).send("Internal Error");
        } else {
          res.send(datos);
        }
      });
  });


  //Función GET con filtro
  app.get(API_BASE + "/vehicles-stock/search", (req, res) => {
    const queryParams = req.query;

    //Parseamos Integers
    const numericAttributes = ["year", "obs_value", "flights_passangers", "cars_deaths"];
    numericAttributes.forEach(attr => {
      if (queryParams[attr]) {
        queryParams[attr] = parseInt(queryParams[attr]);
        if (isNaN(queryParams[attr])) {
          return res.sendStatus(400, "Bad Request");
        }
      }
    });

    // Establecer los parámetros de paginación predeterminados
    const page = parseInt(queryParams.page) || 1; // Página predeterminada: 1
    const limit = parseInt(queryParams.limit) || 10; // Límite predeterminado: 10

    // Calcular el índice de inicio y el número de elementos a mostrar en la página actual
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Construir el filtro para la consulta a la base de datos
    const filter = { $and: [] };
    for (const key in queryParams) {
      // Excluir los parámetros de paginación del filtro
      if (key !== "page" && key !== "limit") {
        const condition = {};
        condition[key] = queryParams[key];
        filter.$and.push(condition);
      }
    }

    // Consultar la base de datos con el filtro construido
    db_TLR.find(filter, { _id: 0, id: 0 })
      .exec((err, filteredData) => {
        if (err) {
          return res.sendStatus(500, "Internal Error");
        }

        // Aplicar paginación después de obtener los resultados de la consulta
        const paginatedData = filteredData.slice(startIndex, endIndex);

        if (paginatedData.length === 0) {
          return res.sendStatus(404, "Not Found");
        }

        res.status(200).send(paginatedData);
      });
  });

  //Métodos POST

  //Método POST Persistente con ID
  app.post(API_BASE + "/vehicles-stock/:id", (req, res) => {
    const id = req.params.id;
    if (id) {
      return res.sendStatus(405, "Bad Request");
    }
  });

  //Método POST Persistente sin ID
  app.post(API_BASE + "/vehicles-stock", (req, res) => {

    const expectedFields = ["freq", "vehicle", "unit", "geo", "year", "obs_value", "flights_passangers", "cars_deaths"];
    const receivedFields = Object.keys(req.body);
    const unexpectedFields = receivedFields.filter(field => !expectedFields.includes(field));

    // Verificar si se recibieron campos adicionales no esperados
    if (unexpectedFields.length > 0 || 'id' in req.body) {
      return res.sendStatus(400, "Bad Request");
    }

    //Verificamos que no exista dicha entrada
    db_TLR.findOne({ year: req.body.year, geo: req.body.geo }, (err, existingVehicle) => {
      if (err) {
        res.sendStatus(500);
      }
      if (existingVehicle) {
        res.sendStatus(409);
      }
    });

    // Si no se proporciona un ID en el cuerpo de la solicitud, generar uno nuevo
    db_TLR.find({}).sort({ id: -1 }).limit(1).exec((err, lastVehicle) => {
      if (err) {
        res.sendStatus(500);
      }
      const lastId = lastVehicle.length > 0 ? parseInt(lastVehicle[0].id) : 0;
      req.body.id = (lastId + 1).toString(); // Asignar un nuevo ID al vehículo
      // Insertar el nuevo vehículo en la base de datos
      db_TLR.insert(req.body, (err, newVehicle) => {
        if (err) {
          res.sendStatus(500);
        }
        res.sendStatus(201);
      });
    });
  });

  //Método PUT

  //PUT Not Allowed
  app.put(API_BASE + "/vehicles-stock", (req, res) => {
    return res.sendStatus(405, "Method Not Allowed")
  });

  //PUT Normal
  app.put(API_BASE + "/vehicles-stock/:id", (req, res) => {
    const idURL = req.params.id;
    const idBody = req.body.id;
    const updatedVehicle = req.body;

    // Verificar si el ID de la URL es válido
    const idURLInt = parseInt(idURL);
    if (isNaN(idURLInt) || idURLInt < 0) {
      return res.sendStatus(400);
    }

    // Verificar si el ID del body es válido
    const idBodyInt = parseInt(idBody);
    if (isNaN(idBodyInt) || idBodyInt < 0) {
      return res.sendStatus(400);
    }

    // Verificar que coincidan ambos ID
    if (idBodyInt !== idURLInt) {
      return res.sendStatus(400);
    }

    // Buscar el vehículo por su ID y actualizarlo
    db_TLR.findOne({ id: idURLInt }, (err, existingVehicle) => {
      if (err) {
        return res.sendStatus(500);
      }
      if (!existingVehicle) {
        return res.sendStatus(404);
      }

      // Actualizar el vehículo en la base de datos
      db_TLR.update({ id: idURLInt }, updatedVehicle, {}, (err, numReplaced) => {
        if (err) {
          return res.sendStatus(500);
        }
        if (numReplaced === 0) {
          return res.sendStatus(500);
        }
        return res.sendStatus(200);
      });
    });
  });


  //DELETE Persistente

  // DELETE Completo
  app.delete(API_BASE + "/vehicles-stock", (req, res) => {
    // Eliminar todas las entradas de la base de datos
    db_TLR.remove({}, { multi: true }, (err, numRemoved) => {
      if (err) {
        res.sendStatus(500);
      }
      res.sendStatus(200);
    });
  });

  // DELETE por ID
  app.delete(API_BASE + "/vehicles-stock/:id", (req, res) => {
    const id = parseInt(req.params.id);

    // Verificar si el ID es válido
    if (isNaN(id) || id < 0) {
      return res.sendStatus(400);
    }

    // Eliminar el vehículo por ID de la base de datos
    db_TLR.remove({ "id": id }, {}, (err, numRemoved) => {
      if (err) {
        return res.sendStatus(500);
      } else {
        if (numRemoved >= 1) {
          return res.sendStatus(200);
        } else {
          return res.sendStatus(404);
        }
      }
    });
  });


  let initial_datos_TLR = [
    {
      id: 1,
      freq: 'A',
      vehicle: 'BUS_TOT',
      unit: 'NR',
      geo: 'Albania',
      year: 2017,
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
      year: 2021,
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
      year: 1990,
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
      year: 1991,
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
      year: 1992,
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
      year: 2003,
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
      year: 2004,
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
      year: 2005,
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
      year: 2006,
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
      year: 2007,
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
      year: 2008,
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
      year: 2009,
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
      year: 2010,
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
      year: 2011,
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
      year: 2012,
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
      year: 2013,
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
      year: 2012,
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
      year: 2013,
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
      year: 2014,
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
      year: 2015,
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
      year: 2016,
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
      year: 2017,
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
      year: 2018,
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
      year: 2019,
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
      year: 2014,
      obs_value: 44693,
      flights_passangers: 2532,
      cars_deaths: 1397
    }

  ]




}

