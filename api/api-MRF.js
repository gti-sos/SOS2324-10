const API_BASE = "/api/v1/gdp-growth-rates"

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const datos_MRF = require("../index-MRF");
app.use(bodyParser.json());

var datos = [];

//API Miguel
function API_MRF(app){


// -------------------------------- GET -------------------------------------

    // Carga inicial de datos
    app.get(API_BASE + "/loadInitialData", (req, res) => {
         if(datos.length === 0){
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
                    growth_rate_2030: 71573,
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
                }
            ];

            const datos_MRF = data.map((entry, index) => {
                const { dataflow, last_update, ...rest } = entry;
                return { id: index + 1, ...rest };
            });

            for (let i=0; i < data.length; i++){
                datos.push(datos_MRF[i]);
            }
            res.sendStatus(201, "CREATED");
         } else {
            res.send(JSON.stringify(datos))
            res.sendStatus(200, "OK");
         }
    });

    //OBTENER TODOS LOS RECURSOS
    app.get(API_BASE + "/", (req, res) => {
        res.send(JSON.stringify(datos));
        req.sendStatus(200, "OK");
    });

    //OBTENER RECURSO CONCRETO
    app.get(API_BASE + "/:geo", (req, res) => {
        const pais = req.params.geo;
        const filtro = datos_MRF.filter(dato => dato.geo === pais);

        if(filtro.length  > 0){
            res.sendStatus(200, "OK").send(filtro);
        } else {
            res.sendStatus(404, "NOT FOUND");
        }   

    });


// -------------------------------------- POST -----------------------------

    //CREAR RECURSO CONCRETO
    app.post(API_BASE + "/", (req, res) => {
        const newGDP = req.body;
        //Verificamos que no exista un elemento con el mismo id
        const duplicateId = datos_MRF.some(gdp => gdp.id === newGDP.id);
        
        if (duplicateId) {
            //Si hay elemento con mismo id, devolver error
            return res.sendStatus(409, "CONFLICT");
        } else if (!newGDP || Object.keys(newGDP).length === 0){
            return res.sendStatus(400, "BAD REQUEST")
        } else {
            datos_MRF.push(newGDP);
            return res.sendStatus(201, "CREATED");
        }
       

    });

    //NO SE PUEDE HACER POST DE UN RECURSO CONCRETO
    app.post(API_BASE + "/:geo", (req, res) => {
        res.sendStatus(405, "METHOD NOT ALLOWED");
    });

    
// -------------------------------------- DELETE -----------------------------
   
    //ELIMINAR TODAS LAS VARIABLES
    app.delete(API_BASE + "/", (req, res) => {
        if(datos_MRF.length > 0){
            datos_MRF = []
            res.sendStatus(200, "OK");
        } else {
            res.sendStatus(404, "NOT FOUND");
        }
      

    });

    //ELIMINAR RECURSO CONCRETO
    app.delete(API_BASE + "/:geo", (req, res) => {
        
        const pais = req.params.geo;
        const filtro = datos_MRF.filter(dato => dato.geo !== pais);

        if(filtro.length < datos_MRF.length){
            datos_MRF = filtro;
            res.sendStatus(200, "OK");
        } else {
            res.sendStatus(404, "NOT FOUND");
        }   
    });

// -------------------------------------- PUT -----------------------------

    // NO SE PUEDE HACER UN PUT SOBRE TODOS LOS RECURSOS
    app.put(API_BASE + "/", (req, res) => {
       res.sendStatus(405, "METHOD NOT ALLOWED");
    });


    //ACTUALIZAR RECURSOS CONCRETOS
    app.put(API_BASE + "/:geo", (req, res) => {
        
        const pais = req.params.geo;
        let data = req.body;
        const filtro = datos_MRF.findIndex(dato => dato.geo === pais);

        if (filtro.length === 0){
            res.sendStatus(404, "NOT FOUND");
        } else {
            for (let i= 0; i < datos_MRF.length; i++){
                if(datos_MRF[i].geo === pais){
                    datos_MRF[i] = data;
                }
            }
            res.sendStatus(200, "OK");
        }
    });
}

module.exports.mrfv1 = API_MRF;




