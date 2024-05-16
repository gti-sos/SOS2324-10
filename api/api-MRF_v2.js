console.log("Carga api-MRF-v1");
const API_BASE = "/api/v2/gdp-growth-rates"; // Define la ruta base para todas las peticiones de la API

import express from "express"; // Importa Express para el manejo de rutas y middleware
const app = express(); // Inicializa la aplicación Express
import bodyParser from "body-parser"; // Importa body-parser para analizar el cuerpo de las solicitudes HTTP

app.use(bodyParser.json()); // Usa body-parser para analizar el cuerpo de las solicitudes como JSON

function backend_MRF_v2(app, db_MRF) {

    //REDIRECCIÓN A DOCUMENTACIÓN API-V1
    app.get("/api/v1/gdp-growth-rates" + "/docs", (req, res) => {
        res.redirect("https://documenter.getpostman.com/view/32965505/2sA2xiYCme"); // Redirige a la documentación de la API v1
    });

    //REDIRECCIÓN A DOCUMENTACIÓN API-V2
    app.get(API_BASE + "/docs", (req, res) => {
        res.redirect("https://documenter.getpostman.com/view/32965505/2sA35G52v3"); // Redirige a la documentación de la API v2
    });


    //CARGA INICIAL DE DATOS
    app.get(API_BASE + "/loadInitialData", (req, res) => {
        // Carga datos iniciales en la base de datos si está vacía
        db_MRF.find({}, (err, data) => {
            if (err) {
                res.sendStatus(500); // Error del servidor
            } else if (data.length === 0) {
                db_MRF.insert(datos_MRF, (err, newDocs) => {
                    if (err) {
                        res.sendStatus(500); // Error del servidor
                    } else {
                        res.sendStatus(200); // Éxito
                    }
                });

            } else {
                res.sendStatus(200); // Éxito
            }
        });
    });


    // -------------------------------------- GET -----------------------------

    // Manejo de la petición GET principal
    app.get(API_BASE + "/", (req, res) => {
        // Extrae los parámetros de consulta de la solicitud
        const { frequency, unit, na_item, geo, time_period, obs_value,
            growth_rate_2030, growth_rate_2040, limit = 10, offset = 0, from, to } = req.query;

        // Construye la consulta en base a los parámetros de consulta recibidos
        const query = {};
        if (frequency) query.frequency = frequency;
        if (unit) query.unit = unit;
        if (na_item) query.na_item = na_item;
        if (geo) query.geo = geo;
        if (time_period) query.time_period = parseInt(time_period);
        if (obs_value) query.obs_value = parseInt(obs_value);
        if (growth_rate_2030) query.growth_rate_2030 = parseInt(growth_rate_2030);
        if (growth_rate_2040) query.growth_rate_2040 = parseInt(growth_rate_2040);

        // Manejo de la consulta de intervalo de tiempo
        if (from && to) {
            query.time_period = { $gte: parseInt(from), $lte: parseInt(to) };
        } else if (from) {
            query.time_period = { $gte: parseInt(from) };
        } else if (to) {
            query.time_period = { $lte: parseInt(to) };
        }

        // Realiza la consulta a la base de datos
        db_MRF.find(query, { _id: 0, id: 0 })
            .skip(parseInt(offset)) // Omite resultados según el desplazamiento
            .limit(parseInt(limit)) // Limita la cantidad de resultados devueltos
            .exec((error, results) => {
                if (error) {
                    res.sendStatus(500); // Error del servidor
                } else if (results.length === 0) {
                    res.sendStatus(404); // No se encontraron resultados
                } else {
                    db_MRF.count(query, (countError, totalCount) => {
                        if (countError) {
                            res.sendStatus(500); // Error del servidor
                        } else {
                            res.status(200).json(results); // Devuelve los resultados en formato JSON
                        }
                    });
                }
            });

    });

    // Manejo de la petición GET para obtener todos los datos
    app.get(API_BASE + "/all", (req, res) => {
        // Obtiene todos los datos de la base de datos
        db_MRF.find({}, { _id: 0, id: 0 }, (error, results) => {
            if (error) {
                res.sendStatus(500); // Error del servidor
            } else {
                res.status(200).json(results); // Devuelve los resultados en formato JSON
            }
        });
    });

    // Manejo de la petición GET para búsqueda
    app.get(API_BASE + "/search", (req, res) => {
        const queryParams = req.query;
        const limit = parseInt(queryParams.limit) || 10; // Tamaño predeterminado de la página
        const offset = parseInt(queryParams.offset) || 0; // Desplazamiento predeterminado
        delete queryParams.limit;
        delete queryParams.offset;

        // Convertir los atributos numéricos a enteros si están presentes
        const numericAttributes = ["time_period", "obs_value", "growth_rate_2030", "growth_rate_2040"];
        numericAttributes.forEach(attr => {
            if (queryParams[attr]) {
                queryParams[attr] = parseInt(queryParams[attr]);
                if (isNaN(queryParams[attr])) {
                    return res.sendStatus(400); // Parámetro numérico no válido
                }
            }
        });

        if (queryParams.from && queryParams.to) {
            queryParams.time_period = { $gte: parseInt(queryParams.from), $lte: parseInt(queryParams.to) };
            delete queryParams.from;
            delete queryParams.to;
        }

        // Consultar la base de datos con el filtro construido y la paginación
        db_MRF.find(queryParams, { _id: 0, id: 0 })
            .skip(offset)
            .limit(limit)
            .exec((error, results) => {
                if (error) {
                    res.sendStatus(500); // Error del servidor
                } else if (results.length === 0) {
                    res.sendStatus(404); // No se encontraron resultados
                } else {
                    return res.send(results); // Devuelve los resultados
                }
            });
    });



    // Manejo de la petición GET para obtener datos por ubicación (geo)
    app.get(API_BASE + "/:geo", (req, res) => {
        const geo = req.params.geo;

        // Consultar la base de datos con el filtro de geo
        db_MRF.find({ geo }, { _id: 0, id: 0 }, (error, results) => {
            if (error) {
                res.sendStatus(500); // Error del servidor
            } else if (results.length === 0) {
                res.sendStatus(404); // No se encontraron resultados
            } else {
                res.status(200).json(results); // Devuelve los resultados en formato JSON
            }
        });
    });




    // Ruta GET para obtener datos filtrados por ubicación geográfica y período de tiempo
    app.get(API_BASE + "/:geo/:time_period", (req, res) => {
        // Extraer los parámetros de la URL de la solicitud
        const geo = req.params.geo; // Ubicación geográfica
        const time_period = parseInt(req.params.time_period); // Período de tiempo (convertido a número)

        // Verificar si el período de tiempo es un número válido
        if (isNaN(time_period)) {
            return res.sendStatus(400, "Bad Request"); // Enviar estado 400 (Solicitud incorrecta) si no es un número válido
        }

        // Consultar la base de datos para encontrar datos que coincidan con la ubicación geográfica y el período de tiempo
        db_MRF.find({ geo: geo, time_period: time_period }, { _id: 0, id: 0 })
            .exec((err, filteredData) => {
                // Manejar errores
                if (err) {
                    return res.sendStatus(500, "Internal Error"); // Enviar estado 500 (Error interno) si hay un error en la consulta
                }

                // Si no se encuentra ningún dato que coincida con los criterios de filtro, enviar estado 404 (No encontrado)
                if (filteredData.length === 0) {
                    return res.sendStatus(404, "Not Found");
                }

                // Enviar estado 200 (Éxito) junto con los datos filtrados encontrados
                res.status(200).send(filteredData[0]);
            });
    });

    app.post(API_BASE + "/*", (req, res) => {
        res.sendStatus(405);
    });
    
    // Ruta POST para crear nuevos datos
    app.post(API_BASE + "/", (req, res) => {
        // Extraer los datos del cuerpo de la solicitud
        const newData = req.body;

        // Validar la presencia de todos los campos necesarios en los datos
        if (!newData.geo || !newData.time_period || !newData.frequency || !newData.unit
            || !newData.na_item || !newData.obs_value || !newData.growth_rate_2030 || !newData.growth_rate_2040) {
            return res.sendStatus(400); // Enviar estado 400 (Solicitud incorrecta) si faltan campos
        }

        // Buscar duplicados basados en ubicación geográfica y período de tiempo
        db_MRF.findOne({ geo: newData.geo, time_period: newData.time_period }, (err, doc) => {
            // Manejar errores
            if (err) {
                return res.sendStatus(500); // Enviar estado 500 (Error interno) si hay un error en la consulta
            } else if (doc) {
                res.sendStatus(409); // Enviar estado 409 (Conflicto) si se encuentra un duplicado
            } else {
                // Insertar nuevos datos si no hay duplicados
                db_MRF.insert(newData, (err, newDoc) => {
                    // Manejar errores
                    if (err) {
                        return res.sendStatus(500); // Enviar estado 500 (Error interno) si hay un error en la inserción
                    } else {
                        res.sendStatus(201); // Enviar estado 201 (Creado) si los datos se insertan correctamente
                    }
                });
            }
        });
    });

    // Rutas PUT para actualizar datos existentes
    // El código de estas rutas es similar, se explicará el primer caso y el patrón se repetirá para los siguientes

    // Ruta PUT para actualizar todos los datos (no permitido)
    app.put(API_BASE + "/", (req, res) => {
        res.sendStatus(405, "METHOD NOT ALLOWED"); // Enviar estado 405 (Método no permitido)
    });

    // Ruta PUT para actualizar datos por ubicación geográfica
    app.put(API_BASE + "/:geo", (req, res) => {
        // Extraer la ubicación geográfica de la URL
        const geoURL = req.params.geo;
        // Extraer los datos actualizados del cuerpo de la solicitud
        const updatedGdp = req.body;

        // Validar la presencia de todos los campos necesarios en los datos actualizados
        // (código similar al de la ruta POST)

        // Buscar el dato existente por la ubicación geográfica
        db_MRF.findOne({ geo: geoURL }, (err, existingGdp) => {
            // Manejar errores

            // Actualizar el dato existente con los nuevos datos
            db_MRF.update({ geo: geoURL }, updatedGdp, {}, (err, numReplaced) => {
                // Manejar errores y enviar respuesta de acuerdo al resultado de la actualización
            });
        });
    });

    // Rutas DELETE para eliminar datos
    // El código de estas rutas sigue un patrón similar al de las rutas PUT, se explicará el primer caso y el patrón se repetirá para los siguientes

    // Ruta DELETE para eliminar todos los datos
    app.delete(API_BASE + "/", (req, res) => {
        // Eliminar todos los datos de la base de datos
        db_MRF.remove({}, { multi: true }, (err, numRemoved) => {
            // Manejar errores y enviar respuesta de acuerdo al resultado de la eliminación
        });
    });

    // Ruta DELETE para eliminar datos por ubicación geográfica
    app.delete(API_BASE + "/:geo", (req, res) => {
        // Extraer la ubicación geográfica de la URL
        const geoURL = req.params.geo;

        // Eliminar los datos por ubicación geográfica
        db_MRF.remove({ geo: geoURL }, {}, (err, numRemoved) => {
            // Manejar errores y enviar respuesta de acuerdo al resultado de la eliminación
        });
    });

    // Ruta DELETE para eliminar un dato específico por ubicación geográfica y período de tiempo
    app.delete(API_BASE + "/:geo/:time_period", (req, res) => {
        // Extraer la ubicación geográfica y el período de tiempo de la URL
        const geoURL = req.params.geo;
        const time_periodURL = parseInt(req.params.time_period);

        // Verificar si el período de tiempo es un número válido
        if (isNaN(time_periodURL)) {
            return res.sendStatus(400); // Enviar estado 400 (Solicitud incorrecta) si el período de tiempo no es un número válido
        }

        // Eliminar el dato específico por ubicación geográfica y período de tiempo
        db_MRF.remove({ geo: geoURL, time_period: time_periodURL }, {}, (err, numRemoved) => {
            // Manejar errores y enviar respuesta de acuerdo al resultado de la eliminación
        });
    });



    // ------------------------- INITIAL DATA -----------------------------


    let data = [
        {
            dataflow: 'estat:teco0115(1.0)',
            last_update: '02/02/24 23:00:00',
            frequency: 'a',
            unit: 'clv_pch_pre',
            na_item: 'b1gq',
            geo: 'austria',
            time_period: 2020,
            obs_value: -6.6,
            growth_rate_2030: 30357,
            growth_rate_2040: 34360
        },
        {
            dataflow: 'estat:teco0115(1.0)',
            last_update: '02/02/24 23:00:00',
            frequency: 'a',
            unit: 'clv_pch_pre',
            na_item: 'b1gq',
            geo: 'austria',
            time_period: 2021,
            obs_value: 4.2,
            growth_rate_2030: 34832,
            growth_rate_2040: 39426
        },
        {
            dataflow: 'estat:teco0115(1.0)',
            last_update: '02/02/24 23:00:00',
            frequency: 'a',
            unit: 'clv_pch_pre',
            na_item: 'b1gq',
            geo: 'austria',
            time_period: 2022,
            obs_value: 4.8,
            growth_rate_2030: 51398,
            growth_rate_2040: 58177
        },
        {
            dataflow: 'estat:teco0115(1.0)',
            last_update: '02/02/24 23:00:00',
            frequency: 'a',
            unit: 'clv_pch_pre',
            na_item: 'b1gq',
            geo: 'belgium',
            time_period: 2020,
            obs_value: -5.3,
            growth_rate_2030: 71574,
            growth_rate_2040: 81533
        },
        {
            dataflow: 'estat:teco0115(1.0)',
            last_update: '02/02/24 23:00:00',
            frequency: 'a',
            unit: 'clv_pch_pre',
            na_item: 'b1gq',
            geo: 'belgium',
            time_period: 2021,
            obs_value: 6.9,
            growth_rate_2030: 44930,
            growth_rate_2040: 51183
        },
        {
            dataflow: 'estat:teco0115(1.0)',
            last_update: '02/02/24 23:00:00',
            frequency: 'a',
            unit: 'clv_pch_pre',
            na_item: 'b1gq',
            geo: 'belgium',
            time_period: 2022,
            obs_value: 3.0,
            growth_rate_2030: 32478,
            growth_rate_2040: 36998
        },
        {
            dataflow: 'estat:teco0115(1.0)',
            last_update: '02/02/24 23:00:00',
            frequency: 'a',
            unit: 'clv_pch_pre',
            na_item: 'b1gq',
            geo: 'czech_republic',
            time_period: 2020,
            obs_value: -5.5,
            growth_rate_2030: 42058,
            growth_rate_2040: 49646
        },
        {
            dataflow: 'estat:teco0115(1.0)',
            last_update: '02/02/24 23:00:00',
            frequency: 'a',
            unit: 'clv_pch_pre',
            na_item: 'b1gq',
            geo: 'czech_republic',
            time_period: 2021,
            obs_value: 3.6,
            growth_rate_2030: 15609,
            growth_rate_2040: 18424
        },
        {
            dataflow: 'estat:teco0115(1.0)',
            last_update: '02/02/24 23:00:00',
            frequency: 'a',
            unit: 'clv_pch_pre',
            na_item: 'b1gq',
            geo: 'czech_republic',
            time_period: 2022,
            obs_value: 2.4,
            growth_rate_2030: 17403,
            growth_rate_2040: 20542
        },
        {
            dataflow: 'estat:teco0115(1.0)',
            last_update: '02/02/24 23:00:00',
            frequency: 'a',
            unit: 'clv_pch_pre',
            na_item: 'b1gq',
            geo: 'denmark',
            time_period: 2020,
            obs_value: -2.4,
            growth_rate_2030: 66538,
            growth_rate_2040: 75680
        },
        {
            dataflow: 'estat:teco0115(1.0)',
            last_update: '02/02/24 23:00:00',
            frequency: 'a',
            unit: 'clv_pch_pre',
            na_item: 'b1gq',
            geo: 'denmark',
            time_period: 2021,
            obs_value: 6.8,
            growth_rate_2030: 38794,
            growth_rate_2040: 44123
        },
        {
            dataflow: 'estat:teco0115(1.0)',
            last_update: '02/02/24 23:00:00',
            frequency: 'a',
            unit: 'clv_pch_pre',
            na_item: 'b1gq',
            geo: 'denmark',
            time_period: 2022,
            obs_value: 2.7,
            growth_rate_2030: 49658,
            growth_rate_2040: 56480
        },
        {
            dataflow: 'estat:teco0115(1.0)',
            last_update: '02/02/24 23:00:00',
            frequency: 'a',
            unit: 'clv_pch_pre',
            na_item: 'b1gq',
            geo: 'spain',
            time_period: 2021,
            obs_value: 6.4,
            growth_rate_2030: 33894,
            growth_rate_2040: 37961
        },
        {
            dataflow: 'estat:teco0115(1.0)',
            last_update: '02/02/24 23:00:00',
            frequency: 'a',
            unit: 'clv_pch_pre',
            na_item: 'b1gq',
            geo: 'spain',
            time_period: 2022,
            obs_value: 5.8,
            growth_rate_2030: 36109,
            growth_rate_2040: 40443
        },
        {
            dataflow: 'estat:teco0115(1.0)',
            last_update: '02/02/24 23:00:00',
            frequency: 'a',
            unit: 'clv_pch_pre',
            na_item: 'b1gq',
            geo: 'spain',
            time_period: 2023,
            obs_value: 2.5,
            growth_rate_2030: 32608,
            growth_rate_2040: 36522
        },
        {
            dataflow: 'estat:teco00115(1.0)',
            last_update: '02/02/24 23:00:00',
            frequency: 'a',
            unit: 'clv_pch_pre',
            na_item: 'b1gq',
            geo: 'iceland',
            time_period: 2020,
            obs_value: -8.7,
            growth_rate_2030: 46784,
            growth_rate_2040: 33489
        },
        {
            dataflow: 'estat:teco00115(1.0)',
            last_update: '02/02/24 23:00:00',
            frequency: 'a',
            unit: 'clv_pch_pre',
            na_item: 'b1gq',
            geo: 'iceland',
            time_period: 2021,
            obs_value: 2.8,
            growth_rate_2030: 54779,
            growth_rate_2040: 37992
        },
        {
            dataflow: 'estat:teco00115(1.0)',
            last_update: '02/02/24 23:00:00',
            frequency: 'a',
            unit: 'clv_pch_pre',
            na_item: 'b1gq',
            geo: 'iceland',
            time_period: 2022,
            obs_value: 4.6,
            growth_rate_2030: 48313,
            growth_rate_2040: 33302
        },
        {
            dataflow: 'estat:teco00115(1.0)',
            last_update: '02/02/24 23:00:00',
            frequency: 'a',
            unit: 'clv_pch_pre',
            na_item: 'b1gq',
            geo: 'italy',
            time_period: 2020,
            obs_value: -8.5,
            growth_rate_2030: 33212,
            growth_rate_2040: 27883
        },
        {
            dataflow: 'estat:teco00115(1.0)',
            last_update: '02/02/24 23:00:00',
            frequency: 'a',
            unit: 'clv_pch_pre',
            na_item: 'b1gq',
            geo: 'italy',
            time_period: 2021,
            obs_value: 8.9,
            growth_rate_2030: 35994,
            growth_rate_2040: 28373
        },
        {
            dataflow: 'estat:teco00115(1.0)',
            last_update: '02/02/24 23:00:00',
            frequency: 'a',
            unit: 'clv_pch_pre',
            na_item: 'b1gq',
            geo: 'italy',
            time_period: 2022,
            obs_value: 3.9,
            growth_rate_2030: 35442,
            growth_rate_2040: 29992
        },
        {
            dataflow: 'estat:teco00115(1.0)',
            last_update: '02/02/24 23:00:00',
            frequency: 'a',
            unit: 'clv_pch_pre',
            na_item: 'b1gq',
            geo: 'bulgary',
            time_period: 2020,
            obs_value: -4.0,
            growth_rate_2030: 33221,
            growth_rate_2040: 28764
        },
        {
            dataflow: 'estat:teco00115(1.0)',
            last_update: '02/02/24 23:00:00',
            frequency: 'a',
            unit: 'clv_pch_pre',
            na_item: 'b1gq',
            geo: 'bulgary',
            time_period: 2021,
            obs_value: 7.7,
            growth_rate_2030: 35482,
            growth_rate_2040: 33029
        },
        {
            dataflow: 'estat:teco00115(1.0)',
            last_update: '02/02/24 23:00:00',
            frequency: 'a',
            unit: 'clv_pch_pre',
            na_item: 'b1gq',
            geo: 'bulgary',
            time_period: 2022,
            obs_value: 3.9,
            growth_rate_2030: 29843,
            growth_rate_2040: 31029
        },
        {
            dataflow: 'estat:teco00115(1.0)',
            last_update: '02/02/24 23:00:00',
            frequency: 'a',
            unit: 'clv_pch_pre',
            na_item: 'b1gq',
            geo: 'albania',
            time_period: 2018,
            obs_value: 4.0,
            growth_rate_2030: 17335,
            growth_rate_2040: 19220
        },
        {
            dataflow: 'estat:teco00115(1.0)',
            last_update: '02/02/24 23:00:00',
            frequency: 'a',
            unit: 'clv_pch_pre',
            na_item: 'b1gq',
            geo: 'albania',
            time_period: 2019,
            obs_value: 2.1,
            growth_rate_2030: 20123,
            growth_rate_2040: 22139
        },
        {
            dataflow: 'estat:teco00115(1.0)',
            last_update: '02/02/24 23:00:00',
            frequency: 'a',
            unit: 'clv_pch_pre',
            na_item: 'b1gq',
            geo: 'albania',
            time_period: 2020,
            obs_value: -3.5,
            growth_rate_2030: 19837,
            growth_rate_2040: 25398
        },
        {
            dataflow: "estat:teco0115(1.0)",
            last_update: "02/02/24 23:00:00",
            frequency: "a",
            unit: "clv_pch_pre",
            na_item: "b1gq",
            geo: "malta",
            time_period: 2023,
            obs_value: 2.3,
            growth_rate_2030: 15000,
            growth_rate_2040: 18200
        },
        {
            dataflow: "estat:teco0115(1.0)",
            last_update: "02/02/24 23:00:00",
            frequency: "a",
            unit: "clv_pch_pre",
            na_item: "b1gq",
            geo: "portugal",
            time_period: 2023,
            obs_value: 2.6,
            growth_rate_2030: 17000,
            growth_rate_2040: 20200
        },
        {
            dataflow: "estat:teco0115(1.0)",
            last_update: "02/02/24 23:00:00",
            frequency: "a",
            unit: "clv_pch_pre",
            na_item: "b1gq",
            geo: "luxembourg",
            time_period: 2023,
            obs_value: 3.5,
            growth_rate_2030: 44723,
            growth_rate_2040: 42311
        },
        {
            dataflow: "estat:teco0115(1.0)",
            last_update: "02/02/24 23:00:00",
            frequency: "a",
            unit: "clv_pch_pre",
            na_item: "b1gq",
            geo: "malta",
            time_period: 2021,
            obs_value: 2.1,
            growth_rate_2030: 14500,
            growth_rate_2040: 17700
        },
        {
            dataflow: "estat:teco0115(1.0)",
            last_update: "02/02/24 23:00:00",
            frequency: "a",
            unit: "clv_pch_pre",
            na_item: "b1gq",
            geo: "portugal",
            time_period: 2021,
            obs_value: 2.8,
            growth_rate_2030: 16500,
            growth_rate_2040: 19800
        },
        {
            dataflow: "estat:teco0115(1.0)",
            last_update: "02/02/24 23:00:00",
            frequency: "a",
            unit: "clv_pch_pre",
            na_item: "b1gq",
            geo: "luxembourg",
            time_period: 2021,
            obs_value: 3.2,
            growth_rate_2030: 46231,
            growth_rate_2040: 48772
        }

    ];

    const datos_MRF = data.map((entry, index) => {
        const { dataflow, last_update, ...rest } = entry;
        return { id: index + 1, ...rest };
    });

};
export { backend_MRF_v2 };



