
const API_BASE = "/api/v2";
import express from "express";
const app = express();
import bodyParser from "body-parser";
app.use(bodyParser.json());

//Datos Iniciales
let initialDatos = [
  { "id": 1, "freq": "A", "vehicle": "BUS_TOT", "unit": "NR", "geo": "Albania", "year": 2017, "obs_value": 6583, "flights_passangers": 18336, "cars_deaths": 1079 },
  { "id": 2, "freq": "A", "vehicle": "BUS_TOT", "unit": "NR", "geo": "Albania", "year": 2021, "obs_value": 7867, "flights_passangers": 26258, "cars_deaths": 976 },
  { "id": 3, "freq": "A", "vehicle": "BUS_TOT", "unit": "NR", "geo": "Austria", "year": 1990, "obs_value": 9400, "flights_passangers": 25762, "cars_deaths": 958 },
  { "id": 4, "freq": "A", "vehicle": "BUS_TOT", "unit": "NR", "geo": "Austria", "year": 1991, "obs_value": 9400, "flights_passangers": 23582, "cars_deaths": 956 },
  { "id": 5, "freq": "A", "vehicle": "BUS_TOT", "unit": "NR", "geo": "Austria", "year": 1992, "obs_value": 9900, "flights_passangers": 24887, "cars_deaths": 931 },
  { "id": 6, "freq": "A", "vehicle": "BUS_TOT", "unit": "NR", "geo": "España", "year": 2003, "obs_value": 56000, "flights_passangers": 24580, "cars_deaths": 878 },
  { "id": 7, "freq": "A", "vehicle": "BUS_TOT", "unit": "NR", "geo": "España", "year": 2004, "obs_value": 57000, "flights_passangers": 23372, "cars_deaths": 768 },
  { "id": 8, "freq": "A", "vehicle": "BUS_TOT", "unit": "NR", "geo": "España", "year": 2005, "obs_value": 58200, "flights_passangers": 24235, "cars_deaths": 730 },
  { "id": 9, "freq": "A", "vehicle": "BUS_TOT", "unit": "NR", "geo": "España", "year": 2006, "obs_value": 60400, "flights_passangers": 26353, "cars_deaths": 691 },
  { "id": 10, "freq": "A", "vehicle": "BUS_TOT", "unit": "NR", "geo": "España", "year": 2007, "obs_value": 61000, "flights_passangers": 22210, "cars_deaths": 679 },
  { "id": 11, "freq": "A", "vehicle": "BUS_TOT", "unit": "NR", "geo": "Bélgica", "year": 2008, "obs_value": 16000, "flights_passangers": 19744, "cars_deaths": 633 },
  { "id": 12, "freq": "A", "vehicle": "BUS_TOT", "unit": "NR", "geo": "Bélgica", "year": 2009, "obs_value": 16100, "flights_passangers": 17677, "cars_deaths": 552 },
  { "id": 13, "freq": "A", "vehicle": "BUS_TOT", "unit": "NR", "geo": "Bélgica", "year": 2010, "obs_value": 16200, "flights_passangers": 17055, "cars_deaths": 523 },
  { "id": 14, "freq": "A", "vehicle": "BUS_TOT", "unit": "NR", "geo": "Bélgica", "year": 2011, "obs_value": 16100, "flights_passangers": 14031, "cars_deaths": 531 },
  { "id": 15, "freq": "A", "vehicle": "BUS_TOT", "unit": "NR", "geo": "Bélgica", "year": 2012, "obs_value": 16000, "flights_passangers": 13733, "cars_deaths": 455 },
  { "id": 16, "freq": "A", "vehicle": "BUS_TOT", "unit": "NR", "geo": "Bélgica", "year": 2013, "obs_value": 15800, "flights_passangers": 13115, "cars_deaths": 430 },
  { "id": 17, "freq": "A", "vehicle": "BUS_TOT", "unit": "NR", "geo": "Bulgaria", "year": 2012, "obs_value": 23000, "flights_passangers": 12675, "cars_deaths": 479 },
  { "id": 18, "freq": "A", "vehicle": "BUS_TOT", "unit": "NR", "geo": "Bulgaria", "year": 2013, "obs_value": 23300, "flights_passangers": 11562, "cars_deaths": 432 },
  { "id": 19, "freq": "A", "vehicle": "BUS_TOT", "unit": "NR", "geo": "Bulgaria", "year": 2014, "obs_value": 23603, "flights_passangers": 10777, "cars_deaths": 414 },
  { "id": 20, "freq": "A", "vehicle": "BUS_TOT", "unit": "NR", "geo": "Bulgaria", "year": 2015, "obs_value": 24010, "flights_passangers": 10119, "cars_deaths": 409 },
  { "id": 21, "freq": "A", "vehicle": "BUS_TOT", "unit": "NR", "geo": "Bulgaria", "year": 2016, "obs_value": 23359, "flights_passangers": 8537, "cars_deaths": 416 },
  { "id": 22, "freq": "A", "vehicle": "BUS_TOT", "unit": "NR", "geo": "Bulgaria", "year": 2017, "obs_value": 21020, "flights_passangers": 7837, "cars_deaths": 344 },
  { "id": 23, "freq": "A", "vehicle": "BUS_TOT", "unit": "NR", "geo": "Bulgaria", "year": 2018, "obs_value": 20818, "flights_passangers": 9246, "cars_deaths": 362 },
  { "id": 24, "freq": "A", "vehicle": "BUS_TOT", "unit": "NR", "geo": "Bulgaria", "year": 2019, "obs_value": 20687, "flights_passangers": 9026, "cars_deaths": 370 },
  { "id": 25, "freq": "A", "vehicle": "TRC", "unit": "NR", "geo": "Bélgica", "year": 2014, "obs_value": 44693, "flights_passangers": 2532, "cars_deaths": 1397 }
]


// API Tomás

function API_TLR_v2(app, db_TLR) {

  //Agregamos todos los elementos al inicio
  db_TLR.insert(initialDatos);

  app.get('/api/v2/vehicles-stock/docs', (req, res) => {
    const documentationURL = 'https://documenter.getpostman.com/view/19421857/2sA2xiYCmf';

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
        db_TLR.insert(datos_TLR, (err, newDocs) => {
          if (err) {
            res.sendStatus(500, "Internal Error");
          }
          res.sendStatus(201, "OK");
        });
      } else {

        res.sendStatus(201, "OK");
      }
    });
  });

  app.get(API_BASE + "/vehicles-stock/search", (req, res) => {
    const queryParams = req.query;

    // Convertir los atributos numéricos a enteros si están presentes
    const numericAttributes = ["year", "obs_value", "flights_passangers", "cars_deaths"];
    numericAttributes.forEach(attr => {
        if (queryParams[attr]) {
            queryParams[attr] = parseInt(queryParams[attr]);
            if (isNaN(queryParams[attr])) {
                return res.sendStatus(400);
            }
        }
    });

    // Paginación
    
    const page = parseInt(queryParams.page) || 1; // Por defecto, página 1
    const limit = parseInt(req.query.limit);
    // Eliminar parámetros de paginación de los criterios de búsqueda
    delete queryParams.limit;
    delete queryParams.offset;
    delete queryParams.page;

    // Calcular el desplazamiento
    const offset = (page - 1) * limit;

    // Consultar la base de datos con los criterios de búsqueda y paginación
    db_TLR.find(queryParams, { _id: 0, id: 0 }).skip(offset).limit(limit).exec((err, filteredData) => {
        if (err) {
            return res.sendStatus(500);
        }

        if (filteredData.length === 0) {
            return res.sendStatus(404);
        } else {
            return res.send(filteredData);
        }
    });
});







  //Método GET Persistente

  //GET datos completo
  app.get(API_BASE + "/vehicles-stock/", (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    console.log("Limit :" + limit + "  Offset: "+offset)

    db_TLR.find({}, { _id: 0, id: 0 })
      .skip(parseInt(offset)) // Saltar los documentos anteriores según el offset
      .limit(parseInt(limit)) // Limitar el número de documentos devueltos
      .exec((error, datos) => {
        if (error) {
          res.sendStatus(500);
        } else {
          // Utilizar un conjunto para almacenar objetos únicos
          const uniqueData = new Set(datos.map(JSON.stringify));
          // Convertir los objetos únicos de nuevo a objetos JSON
          const uniqueJSON = Array.from(uniqueData).map(JSON.parse);
          res.send(uniqueJSON);
        }
      });
});




  //Función GET con filtro
  app.get(API_BASE + "/vehicles-stock/:geo/:year", (req, res) => {
    const geo = req.params.geo;
    const year = parseInt(req.params.year);

    // Verificar si el año es un número válido
    if (isNaN(year)) {
      return res.sendStatus(400, "Bad Request");
    }

    // Consultar la base de datos con el filtro de geo y year
    db_TLR.find({ geo: geo, year: year }, { _id: 0, id: 0 })
      .exec((err, filteredData) => {
        if (err) {
          return res.sendStatus(500, "Internal Error");
        }

        if (filteredData.length === 0) {
          return res.sendStatus(404, "Not Found");
        }

        res.status(200).send(filteredData[0]);
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
      return res.sendStatus(400);
    }

    //Verificamos que no exista dicha entrada
    db_TLR.findOne({ year: req.body.year, geo: req.body.geo }, (err, existingVehicle) => {
      if (err) {
        return res.sendStatus(500);
      }
      if (existingVehicle) {
        return res.sendStatus(409);
      }

      // Si no existe un vehículo con el mismo year y geo, continuar con la inserción del nuevo vehículo
      db_TLR.find({}).sort({ id: -1 }).limit(1).exec((err, lastVehicle) => {
        if (err) {
          return res.sendStatus(500);
        }
        const lastId = lastVehicle.length > 0 ? parseInt(lastVehicle[0].id) : 0;
        req.body.id = (lastId + 1).toString(); // Asignar un nuevo ID al vehículo
        // Insertar el nuevo vehículo en la base de datos
        db_TLR.insert(req.body, (err, newVehicle) => {
          if (err) {
            return res.sendStatus(500);
          }
          res.sendStatus(201);
        });
      });
    });
  });


  //Método PUT

  //PUT Not Allowed
  app.put(API_BASE + "/vehicles-stock", (req, res) => {
    return res.sendStatus(405, "Method Not Allowed")
  });

  //PUT Normal
  app.put(API_BASE + "/vehicles-stock/:geo/:year", (req, res) => {
    const geoURL = req.params.geo;
    const yearURL = parseInt(req.params.year);
    const updatedVehicle = req.body;

    // Verificar si el año es un número válido
    if (isNaN(yearURL)) {
      return res.sendStatus(400);
    }

    // Verificar que todos los parámetros deseados estén presentes
    const expectedFields = ["freq", "vehicle", "unit", "geo", "year", "obs_value", "flights_passangers", "cars_deaths"];
    const receivedFields = Object.keys(updatedVehicle);
    const missingFields = expectedFields.filter(field => !receivedFields.includes(field));
    if (missingFields.length > 0) {
      return res.sendStatus(400);
    }

    // Verificar que el geo y year de la URL coincidan con los del cuerpo de la solicitud
    if (geoURL !== updatedVehicle.geo || yearURL !== updatedVehicle.year) {
      return res.sendStatus(400);
    }

    // Buscar el vehículo por geo y year y actualizarlo
    db_TLR.findOne({ geo: geoURL, year: yearURL }, (err, existingVehicle) => {
      if (err) {
        return res.sendStatus(500);
      }
      if (!existingVehicle) {
        return res.sendStatus(404);
      }

      // Actualizar el vehículo en la base de datos
      db_TLR.update({ geo: geoURL, year: yearURL }, updatedVehicle, {}, (err, numReplaced) => {
        if (err) {
          return res.sendStatus(500);
        }
        if (numReplaced === 0) {
          return res.sendStatus(500);
        }
        res.sendStatus(200);
      });
    });
  });



  //DELETE Persistente

  // DELETE Completo
  app.delete(API_BASE + "/vehicles-stock", (req, res) => {
    // Eliminar todas las entradas de la base de datos
    db_TLR.remove({}, { multi: true }, (err, numRemoved) => {
      if (err) {
        return res.sendStatus(500);
      }
      res.sendStatus(200);
    });
  });

  // DELETE por ID
  app.delete(API_BASE + "/vehicles-stock/:geo/:year", (req, res) => {
    const geoURL = req.params.geo;
    const yearURL = parseInt(req.params.year);

    // Verificar si el año es un número válido
    if (isNaN(yearURL)) {
      return res.sendStatus(400);
    }

    // Eliminar el vehículo por geo y year de la base de datos
    db_TLR.remove({ geo: geoURL, year: yearURL }, {}, (err, numRemoved) => {
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



  let datos_TLR = [
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







};


export { API_TLR_v2 };