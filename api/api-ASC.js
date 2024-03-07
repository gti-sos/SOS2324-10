const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const API_BASE = "/api/v1";
const csv = require('../index-ASC');
app.use(bodyParser.json());
let dataStore = require("nedb")


module.exports = (app, db_ASC) => {

    // ------------ GET -------------
    // ----------- CUALQUIER CONSULTA GET --------------
    app.get(API_BASE + "/tourisms-per-age", (req, res) => {
        const queryParams = req.query; // Obtener los parámetros de consulta de la solicitud
    
        //Parseamos Integers
        const numericAttributes = ["page", "limit", "skip"]; // Añadir cualquier parámetro numérico adicional aquí
        numericAttributes.forEach(attr => {
            if (queryParams[attr]) {
                queryParams[attr] = parseInt(queryParams[attr]);
                if (isNaN(queryParams[attr])) {
                    return res.status(400).send("Bad Request");
                }
            }
        });
    
        // Establecer los parámetros de paginación predeterminados
        const page = queryParams.page || 1; // Página predeterminada: 1
        const limit = queryParams.limit || 10; // Límite predeterminado: 10
        const skip = (page - 1) * limit; // Calcular el número de documentos a saltar
    
        // Objeto para almacenar parámetros de consulta parseados
        const parsedQueryParams = {};
    
        // Especificación de tipos de datos
        const dataTypes = {
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
    
        // Eliminar parámetros de paginación de queryParams
        delete queryParams.page;
        delete queryParams.limit;
        delete queryParams.skip;
    
        // Parsear los valores de los parámetros de consulta según el tipo de dato especificado
        for (const key in queryParams) {
            const value = queryParams[key];
            const dataType = dataTypes[key];
    
            if (dataType === 'number') {
                parsedQueryParams[key] = parseFloat(value);
            } else {
                parsedQueryParams[key] = value;
            }
        }
    
        // Realizar la búsqueda en la base de datos con los parámetros de consulta parseados y ordenados por ID, con paginación
        db_ASC.find(parsedQueryParams).sort({ id: 1 }).skip(skip).limit(limit).exec((err, data) => {
            if (err) {
                // Si hay un error en la base de datos, enviar error 500 Internal Server Error
                return res.status(500).send("Internal Error");
            }
            if (data.length === 0) {
                // Si no se encontraron datos, enviar error 404 Not Found
                return res.status(404).send("Data not found");
            }
    
            // Eliminar el campo 'id' de cada objeto en el array 'data'
            const responseData = data.map(item => {
                const { _id, ...rest } = item;
                return rest;
            });
    
            // Si se encontraron datos, enviar los resultados en formato JSON sin el campo 'id'
            res.json(responseData);
        });
    });
    
    
    // ------------- LOAD INITIAL DATA ------------------
    app.get(API_BASE + "/tourisms-per-age/loadInitialData", (req, res) => {
        // Comprobar si la base de datos está vacía
        db_ASC.find({}, (err, dato) => {
            if (err) {
                res.sendStatus(500, "Internal Error");
            }
            if (dato.length === 0) {
                // Insertar los datos iniciales solo si la base de datos está vacía
                db_ASC.insert(backupDatas, (err, newDocs) => {
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

    // -------------- POST --------------

    app.post(API_BASE + "/tourisms-per-age", (req, res) => {
        const growth = req.body;
    
        // Validar el JSON recibido
        const expectedKeys = ['frequency', 'unit', 'age', 'geo', 'time_period', 'obs_value', 'gdp', 'volgdp'];
        const actualKeys = Object.keys(growth);
        const isValidJson = expectedKeys.every(key => actualKeys.includes(key));
    
        if (!isValidJson || actualKeys.length !== expectedKeys.length) {
            // El JSON no tiene la estructura esperada
            return res.status(400).send("Bad Request: JSON has invalid structure");
        }
    
        // Obtener el último ID y calcular el nuevo ID
        db_ASC.find({}).sort({ id: -1 }).limit(1).exec((err, lastEntry) => {
            if (err) {
                // Si hay un error en la base de datos, enviar error 500 Internal Server Error
                return res.status(500).send("Internal Error");
            }
    
            const newId = lastEntry.length === 0 ? 1 : lastEntry[0].id + 1;
            growth.id = newId;
    
            // Insertar el nuevo dato en la base de datos
            db_ASC.insert(growth, (err, newDoc) => {
                if (err) {
                    // Si hay un error en la base de datos, enviar error 500 Internal Server Error
                    return res.status(500).send("Internal Error");
                }
                // Enviar respuesta con código 201 Created
                res.status(201).send("Created");
            });
        });
    });
    


    // -------------- PUT --------------

    app.put(API_BASE + "/tourisms-per-age/:id", (req, res) => {

        const idURL = req.params.id;
        const idBody = req.body.id;
        const updatedGdp = req.body;

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

        db_ASC.update({ id: idURLInt }, { $set: updatedGdp }, {}, (err, numReplaced) => {
            if (err) {
                console.error(err);
                return res.sendStatus(500, 'Internal server error');
            }
            if (numReplaced === 0) {
                return res.sendStatus(400, 'Bad request: gdp-rate ID not found');
            }
            return res.sendStatus(200, 'Gdp-rate updated successfully');
        });

    });
    
    app.put(API_BASE + "/tourisms-per-age", (req, res) => {
        res.sendStatus(405, "METHOD NOT ALLOWED");
    });

    // -------------- DELETE --------------

    app.delete(API_BASE + "/tourisms-per-age", (req, res) => {
        db_ASC.remove({}, { multi: true }, (err, numRemoved) => {
            if (err) {
                // Si hay un error en la base de datos, enviar error 500 Internal Server Error
                return res.status(500).send("Internal Error");
            }
            // Enviar respuesta con código 200 OK
            res.status(200).send("Deleted all -> Datos ASC");
        });
    });

    app.delete(API_BASE + "/tourisms-per-age/:age", (req, res) => {
        const ageToDelete = req.params.age;

        // Eliminar datos que coincidan con la edad especificada
        db_ASC.remove({ age: ageToDelete }, { multi: true }, (err, numRemoved) => {
            if (err) {
                // Si hay un error en la base de datos, enviar error 500 Internal Server Error
                return res.status(500).send("Internal Error");
            }
            if (numRemoved === 0) {
                // Si no se encontraron datos para eliminar, enviar error 404 Not Found
                return res.status(404).send("Not Found: No data found with age " + ageToDelete);
            }
            // Enviar respuesta con código 200 OK
            res.status(200).send("Deleted data with age: " + ageToDelete);
        });
    });

    // Manejar todos los otros métodos no permitidos
    app.all(API_BASE + "/tourisms-per-age/*", (req, res) => {
        res.sendStatus(405);
    });

    // ------------ POST --------------

    // app.post(API_BASE + "/tourisms-per-age", (req, res) => {
    //     let growth = req.body;

    //     // Verificar si el body es un JSON válido y tiene la estructura esperada
    //     const expectedStructure = {
    //         'id': 'number',
    //         'frequency': 'string',
    //         'unit': 'string',
    //         'age': 'string',
    //         'geo': 'string',
    //         'time_period': 'number',
    //         'obs_value': 'number',
    //         'gdp': 'number',
    //         'volgdp': 'number'
    //     };

    //     const actualKeys = Object.keys(growth);
    //     const expectedKeys = Object.keys(expectedStructure);
    //     const isValidJson = expectedKeys.every(key => actualKeys.includes(key) && typeof growth[key] === expectedStructure[key]);

    //     if (!isValidJson || actualKeys.length !== expectedKeys.length) {
    //         // El JSON no tiene la estructura esperada
    //         res.status(400).send("Bad Request: JSON has invalid structure");
    //     } else if (csv.some(entry => entry.id === growth.id)) {
    //         // El recurso ya existe, devolver error 409
    //         res.status(409).send("Conflict: Resource already exists");
    //     } else {
    //         // El recurso no existe, agregarlo a csv
    //         csv.push(growth);
    //         res.status(201).send("Created");
    //     }
    // });


    // ---------------- PUT ------------------

    // app.put(API_BASE + "/tourisms-per-age/:geo", (req, res) => {

    //     const pais = req.params.geo;
    //     let data = req.body;
    //     const filtro = csv.findIndex(dato => dato.geo === pais);

    //     if (filtro.length === 0) {
    //         res.sendStatus(404, "NOT FOUND");
    //     } else {
    //         for (let i = 0; i < csv.length; i++) {
    //             if (csv[i].geo === pais) {
    //                 csv[i] = data;
    //             }
    //         }
    //         res.sendStatus(200, "OK");
    //     }
    // });

    // app.put(API_BASE + "/tourisms-per-age", (req, res) => {
    //     res.sendStatus(405, "METHOD NOT ALLOWED");
    // });

    // // -------------- DEL -----------------

    // app.delete(API_BASE + "/tourisms-per-age", (req, res) => {
    //     csv.splice(0, csv.length);
    //     res.sendStatus(200, "Deleted all -> Datos ASC");
    // });


    // app.delete(API_BASE + "/tourisms-per-age/:age", (req, res) => {
    //     const ageToDelete = req.params.age;

    //     // Filtrar los datos que coincidan con la edad especificada
    //     const newData = csv.filter(entry => entry.age !== ageToDelete);

    //     // Verificar si se eliminaron datos
    //     if (newData.length < csv.length) {
    //         // Se eliminaron datos, actualizar csv
    //         csv.splice(0, csv.length, ...newData);
    //         res.status(200).send("Deleted data with age: " + ageToDelete);
    //     } else {
    //         // No se encontraron datos con esa edad
    //         res.status(404).send("Not Found: No data found with age " + ageToDelete);
    //     }
    // });


    

    // Manejar todos los otros accesos a rutas inexistentes
    /**app.use((req, res, next) => {
        res.status(404).send("Not Found");
    });*/
    //app.use((req, res, next) => {
    //    res.status(404).send("Not Found");
    //});

    // Middleware para manejar errores
    // app.use((err, req, res, next) => {
    //     console.error(err.stack);
    //     res.status(500).send('Internal Server Error');
    // });

    let backupData = [
        {
            frequency: 'A',
            unit: 'NR',
            age: 'TOTAL',
            geo: 'BG',
            time_period: 2020,
            obs_value: 2866763,
            gdp: -4,
            volgdp: 75.4
        },
        {
            frequency: 'A',
            unit: 'NR',
            age: 'TOTAL',
            geo: 'BG',
            time_period: 2021,
            obs_value: 2830464,
            gdp: 7.7,
            volgdp: 72.3
        },
        {
            frequency: 'A',
            unit: 'NR',
            age: 'TOTAL',
            geo: 'CZ',
            time_period: 2013,
            obs_value: 4729185,
            gdp: 0.0,
            volgdp: 99.6
        },
        {
            frequency: 'A',
            unit: 'NR',
            age: 'TOTAL',
            geo: 'CZ',
            time_period: 2014,
            obs_value: 4833386,
            gdp: 2.3,
            volgdp: 100.7
        },
        {
            frequency: 'A',
            unit: 'NR',
            age: 'TOTAL',
            geo: 'LT',
            time_period: 2014,
            obs_value: 1205668,
            gdp: 3.5,
            volgdp: 101.1
        },
        {
            frequency: 'A',
            unit: 'NR',
            age: 'TOTAL',
            geo: 'LT',
            time_period: 2015,
            obs_value: 1244063,
            gdp: 2.0,
            volgdp: 100.0
        },
        {
            frequency: 'A',
            unit: 'NR',
            age: 'TOTAL',
            geo: 'ES',
            time_period: 2016,
            obs_value: 22876830,
            gdp: 3.0,
            volgdp: 100.6
        },
        {
            frequency: 'A',
            unit: 'NR',
            age: 'TOTAL',
            geo: 'ES',
            time_period: 2017,
            obs_value: 23500401,
            gdp: 3.0,
            volgdp: 94.4
        },
        {
            frequency: 'A',
            unit: 'NR',
            age: 'TOTAL',
            geo: 'PL',
            time_period: 2015,
            obs_value: 18011775,
            gdp: 4.4,
            volgdp: 100.0
        },
        {
            frequency: 'A',
            unit: 'NR',
            age: 'TOTAL',
            geo: 'PL',
            time_period: 2016,
            obs_value: 18718408,
            gdp: 3.0,
            volgdp: 101.8
        },
        {
            frequency: 'A',
            unit: 'NR',
            age: 'Y10-20',
            geo: 'IT',
            time_period: 2017,
            obs_value: 21318885,
            gdp: 1.9,
            volgdp: 105.3
        },
        {
            frequency: 'A',
            unit: 'NR',
            age: 'Y10-20',
            geo: 'IT',
            time_period: 2018,
            obs_value: 21965599,
            gdp: 1.1,
            volgdp: 102.0
        },
        {
            frequency: 'A',
            unit: 'NR',
            age: 'Y_LT2',
            geo: 'SE',
            time_period: 2018,
            obs_value: 936840,
            gdp: 0.8,
            volgdp: 83.5
        },
        {
            frequency: 'A',
            unit: 'NR',
            age: 'Y_LT2',
            geo: 'SE',
            time_period: 2019,
            obs_value: 882084,
            gdp: 1.0,
            volgdp: 82.2
        },
        {
            frequency: 'A',
            unit: 'NR',
            age: 'Y_LT2',
            geo: 'HU',
            time_period: 2016,


            obs_value: 204007,
            gdp: 2.2,
            volgdp: 103.1
        },
        {
            frequency: 'A',
            unit: 'NR',
            age: 'Y_LT2',
            geo: 'HU',
            time_period: 2017,
            obs_value: 244719,
            gdp: 4.3,
            volgdp: 103.5
        },
        {
            frequency: 'A',
            unit: 'NR',
            age: 'TOTAL',
            geo: 'EU27_2020',
            time_period: 2018,
            obs_value: 240415203,
            gdp: 1.9,
            volgdp: 96.6
        },
        {
            frequency: 'A',
            unit: 'NR',
            age: 'TOTAL',
            geo: 'EU27_2020',
            time_period: 2019,
            obs_value: 244951204,
            gdp: 1.6,
            volgdp: 95.4
        },
        {
            frequency: 'A',
            unit: 'NR',
            age: 'TOTAL',
            geo: 'EU27_2020',
            time_period: 2020,
            obs_value: 247754214,
            gdp: -5.7,
            volgdp: 79.2
        },
        {
            frequency: 'A',
            unit: 'NR',
            age: 'Y2-5',
            geo: 'AT',
            time_period: 2018,
            obs_value: 874539,
            gdp: 2.4,
            volgdp: 90.7
        },
        {
            frequency: 'A',
            unit: 'NR',
            age: 'Y2-5',
            geo: 'AT',
            time_period: 2019,
            obs_value: 900900,
            gdp: 1.5,
            volgdp: 87.5
        },
        {
            frequency: 'A',
            unit: 'NR',
            age: 'TOTAL',
            geo: 'BG',
            time_period: 2013,
            obs_value: 2910235,
            gdp: -0.5,
            volgdp: 94.4
        },
        {
            frequency: 'A',
            unit: 'NR',
            age: 'TOTAL',
            geo: 'BG',
            time_period: 2014,
            obs_value: 3013863,
            gdp: 0.9,
            volgdp: 99.1
        },
        {
            frequency: 'A',
            unit: 'NR',
            age: 'Y5-10',
            geo: 'CH',
            time_period: 2015,
            obs_value: 1315144,
            gdp: 1.6,
            volgdp: 100.0
        },
        {
            frequency: 'A',
            unit: 'NR',
            age: 'Y5-10',
            geo: 'CH',
            time_period: 2016,
            obs_value: 1372084,
            gdp: 2.1,
            volgdp: 99.8
        },
        {
            frequency: 'A',
            unit: 'NR',
            age: 'Y5-10',
            geo: 'CH',
            time_period: 2017,
            obs_value: 1428311,
            gdp: 1.4,
            volgdp: 99.6
        },
        {
            frequency: 'A',
            unit: 'NR',
            age: 'TOTAL',
            geo: 'DE',
            time_period: 2019,
            obs_value: 47715977,
            gdp: 1.1,
            volgdp: 91.1
        },
        {
            frequency: 'A',
            unit: 'NR',
            age: 'TOTAL',
            geo: 'DE',
            time_period: 2020,
            obs_value: 48248584,
            gdp: -3.8,
            volgdp: 79.9
        },
        {
            frequency: 'A',
            unit: 'NR',
            age: 'Y_GT20',
            geo: 'UK',
            time_period: 2016,
            obs_value: 572233,
            gdp: 1.7,
            volgdp: 99.4
        },
        {
            frequency: 'A',
            unit: 'NR',
            age: 'Y_GT20',
            geo: 'UK',
            time_period: 2017,
            obs_value: 617953,
            gdp: 1.7,
            volgdp: 103.6
        },
        {
            frequency: 'A',
            unit: 'NR',
            age: 'Y_GT20',
            geo: 'UK',
            time_period: 2018,
            obs_value: 692318,
            gdp: 1.3,
            volgdp: 103.8
        }

    ]
    const backupDatas = backupData.map((entry, index) => {
        return { id: index + 1, ...entry };
    });
};

