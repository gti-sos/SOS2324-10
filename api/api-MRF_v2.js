
const API_BASE = "/api/v2/gdp-growth-rates"
import express from "express";
const app = express();
import bodyParser from "body-parser";

app.use(bodyParser.json());

function backend_MRF_v2(app, db_MRF){

    //REDIRECCIÓN A DOCUMENTACIÓN API-V1
    app.get("/api/v1/gdp-growth-rates" + "/docs", (req, res) => {
        res.redirect("https://documenter.getpostman.com/view/32965505/2sA2xiYCme");
    });

    //REDIRECCIÓN A DOCUMENTACIÓN API-V2
    app.get(API_BASE + "/docs", (req, res) => {
        res.redirect("https://documenter.getpostman.com/view/32965505/2sA35G52v3");
    });


    //CARGA INICIAL DE DATOS
    app.get(API_BASE + "/loadInitialData", (req, res) => {

        db_MRF.find({}, (err, data) => {
            if (err) {
                res.sendStatus(500);
            } else if (data.length === 0) {
                db_MRF.insert(datos_MRF, (err, newDocs) => {
                    if (err) {
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(200);
                    }
                });

            } else {
                res.sendStatus(200);
            }
        });
    });

    
    // -------------------------------------- GET -----------------------------

    app.get(API_BASE + "/", (req, res) => {
        
        const {frequency, unit, na_item, geo, time_period, obs_value,
            growth_rate_2030, growth_rate_2040, limit = 10, offset = 0, from, to } = req.query;

        const query = {};
        if (frequency) query.frequency = frequency;
        if (unit) query.unit = unit;
        if (na_item) query.na_item = na_item;
        if (geo) query.geo = geo;
        if (time_period) query.time_period = parseInt(time_period);
        if (obs_value) query.obs_value = parseInt(obs_value);
        if (growth_rate_2030) query.growth_rate_2030 = parseInt(growth_rate_2030);
        if (growth_rate_2040) query.growth_rate_2040 = parseInt(growth_rate_2040);

        if (from && to) {
            query.time_period = { $gte: parseInt(from), $lte: parseInt(to) };
        } else if (from) {
            query.time_period = { $gte: parseInt(from) };
        } else if (to) {
            query.time_period = { $lte: parseInt(to) };
        }

        db_MRF.find(query, { _id: 0, id: 0 })
            .skip(parseInt(offset))
            .limit(parseInt(limit))
            .exec((error, results) => {
                if (error) {
                    res.sendStatus(500);
                } else if (results.length === 0) {
                    res.sendStatus(404);
                } else {
                    db_MRF.count(query, (countError, totalCount) => {
                        if (countError) {
                            res.sendStatus(500);
                        } else {
                            
                            res.status(200).json(results);
                        }
                    });
                }
            });
        
    });

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
                    return res.sendStatus(400);
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
                res.sendStatus(500);
            } else if (results.length === 0) {
                res.sendStatus(404);
            } else {
                return res.send(results);
            }
        });
    });
    
    /**
    app.get(API_BASE + "/search", (req, res) => {
        const queryParams = req.query;
    
        // Convertir los atributos numéricos a enteros si están presentes
        const numericAttributes = ["time_period", "obs_value", "growth_rate_2030", "growth_rate_2040"];
        numericAttributes.forEach(attr => {
          if (queryParams[attr]) {
            queryParams[attr] = parseInt(queryParams[attr]);
            if (isNaN(queryParams[attr])) {
              return res.sendStatus(400);
            }
          }
        });
    
        // Consultar la base de datos con el filtro construido
        db_MRF.find(queryParams, { _id: 0, id: 0 }, (err, filteredData) => {
          if (err) {
            return res.sendStatus(500);
          }
    
          if (filteredData.length === 0) {
            return res.sendStatus(404);
          }else{
            return res.send(filteredData);
          }
    
          
        });
    });*/
    
    

    app.get(API_BASE + "/:geo", (req, res) => {
        const geo = req.params.geo;


        // Consultar la base de datos con el filtro de geo
        db_MRF.find({ geo: geo}, { _id: 0, id: 0 })
            .exec((err, filteredData) => {
                if (err) {
                    return res.sendStatus(500, "Internal Error");
                }

                if (filteredData.length === 0) {
                    return res.sendStatus(404, "Not Found");
                }

                res.status(200).send(filteredData);
            });
    });



    app.get(API_BASE + "/:geo/:time_period", (req, res) => {
        const geo = req.params.geo;
        const time_period = parseInt(req.params.time_period);

        // Verificar si el año es un número válido
        if (isNaN(time_period)) {
            return res.sendStatus(400, "Bad Request");
        }

        // Consultar la base de datos con el filtro de geo y time_period
        db_MRF.find({ geo: geo, time_period: time_period }, { _id: 0, id: 0 })
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




    // -------------------------------------- POST -----------------------------

    //NO SE PUEDE HACER POST DE UN RECURSO CONCRETO 
    app.post(API_BASE + "/*", (req, res) => {
        res.sendStatus(405);
    });

    //SOBRE LA RUTA GENERAL
    app.post(API_BASE + "/", (req, res) => {
        const newData = req.body;
        if (!newData.geo || !newData.time_period || !newData.frequency || !newData.unit
            || !newData.na_item || !newData.obs_value || !newData.growth_rate_2030 || !newData.growth_rate_2040) {
            return res.sendStatus(400);
        }

        db_MRF.findOne({ id: newData.id }, (err, doc) => {
            if (err) {
                return res.sendStatus(500);
            } else if (doc) {
                res.sendStatus(409);
            } else {
                db_MRF.insert(newData, (err, newDoc) => {
                    if (err) {
                        return res.sendStatus(500);
                    } else {
                        res.sendStatus(201);
                    }
                });
            }
        });
    });


    // -------------------------------------- PUT -----------------------------

    // NO SE PUEDE HACER UN PUT SOBRE TODOS LOS RECURSOS    
    app.put(API_BASE + "/", (req, res) => {
        res.sendStatus(405, "METHOD NOT ALLOWED");
    });

    app.put(API_BASE + "/:geo", (req, res) => {
        const geoURL = req.params.geo;
        const updatedGdp = req.body;


        const expectedFields = ["frequency", "unit", "na_item", "geo", "time_period", "obs_value", "growth_rate_2030", "growth_rate_2040"];
        const parametersBody = Object.keys(updatedGdp);
        const missingFields = expectedFields.filter(field => !parametersBody.includes(field));
        if (missingFields.length > 0) {
            return res.sendStatus(400);
        }
        /**
        if (geoURL !== updatedGdp.geo) {
            return res.sendStatus(400);
        }*/

        db_MRF.findOne({ geo: geoURL}, (err, existingGdp) => {
            if (err) {
                return res.sendStatus(500);
            }
            if (!existingGdp) {
                return res.sendStatus(404);
            }

            db_MRF.update({ geo: geoURL}, updatedGdp, {}, (err, numReplaced) => {
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


    app.put(API_BASE + "/:geo/:time_period", (req, res) => {
        const geoURL = req.params.geo;
        const time_periodURL = parseInt(req.params.time_period);
        const updatedGdp = req.body;

        /**
         * if (isNaN(time_periodURL)) {
            return res.sendStatus(400);
        }
         */
        

        const expectedFields = ["frequency", "unit", "na_item", "geo", "time_period", "obs_value", "growth_rate_2030", "growth_rate_2040"];
        const parametersBody = Object.keys(updatedGdp);
        const missingFields = expectedFields.filter(field => !parametersBody.includes(field));
        if (missingFields.length > 0) {
            return res.sendStatus(400);
        }

        if (geoURL !== updatedGdp.geo || time_periodURL !== updatedGdp.time_period) {
            return res.sendStatus(400);
        }

        db_MRF.findOne({ geo: geoURL, time_period: time_periodURL }, (err, existingGdp) => {
            if (err) {
                return res.sendStatus(500);
            }
            if (!existingGdp) {
                return res.sendStatus(404);
            }

            db_MRF.update({ geo: geoURL, time_period: time_periodURL }, updatedGdp, {}, (err, numReplaced) => {
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




    // -------------------------------------- DELETE -----------------------------


    //ELIMINAR TODAS LAS VARIABLES
    app.delete(API_BASE + "/", (req, res) => {
        db_MRF.remove({}, { multi: true }, (err, numRemoved) => {
            if (err) {
                console.error(err);
                return res.sendStatus(500);
            }
            return res.sendStatus(200);
        });
    });


    app.delete(API_BASE + "/:geo", (req, res) => {
        const geoURL = req.params.geo;

        // Eliminar el vehículo por geo y time_period de la base de datos
        db_MRF.remove({ geo: geoURL}, {}, (err, numRemoved) => {
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
    //ELIMINAR RECURSO CONCRETO 
    app.delete(API_BASE + "/:geo/:time_period", (req, res) => {
        const geoURL = req.params.geo;
        const time_periodURL = parseInt(req.params.time_period);

        // Verificar si el año es un número válido
        if (isNaN(time_periodURL)) {
            return res.sendStatus(400);
        }

        // Eliminar el vehículo por geo y time_period de la base de datos
        db_MRF.remove({ geo: geoURL, time_period: time_periodURL }, {}, (err, numRemoved) => {
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
        }
    ];

    const datos_MRF = data.map((entry, index) => {
        const { dataflow, last_update, ...rest } = entry;
        return { id: index + 1, ...rest };
    });

};
export {backend_MRF_v2};



