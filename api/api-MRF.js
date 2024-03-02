const API_BASE = "/api/v1/gdp-growth-rates"

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

var datos = [];
const datos_MRF = require('./../index-MRF');

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

    // GET ruta generica
    app.get(API_BASE + "/", (req, res) => {
        res.send(JSON.stringify(datos));
        req.sendStatus(200, "OK");
    });

// -------------------------------------- POST -----------------------------

    app.post(API_BASE + "/", (req, res) => {
        const newGDP = req.body;
        //Verificamos que no exista un elemento con el mismo id
        const duplicateId = datos_MRF.some(gdp => gdp.id === newGDP.id);
        if (duplicateId) {
            //Si hay elemento con mismo id, devolver error
            res.sendStatus(409, "CONFLICT");
        } else if (newGDP.length === 0){
            res.sendStatus(400, "BAD REQUEST")
        } else {
            datos.push(newGDP);
            res.sendStatus(201, "CREATED");
        }
       

    });

    app.post(API_BASE + "/:geo", (req, res) => {
        //No está permitido hacer un post de un recurso concreto
        const geo = req.params.geo;
        let data = req.body;
        res.sendStatus(405, "METHOD NOT ALLOWED");
    });

    
   
    app.delete(API_BASE + "/", (req, res) => {
        // Si no se añade id en la URL se borrarán todas las entradas
        if (!req.query.id) {
            datos_MRF.splice(0, datos_MRF.length);
            return res.sendStatus(200, "OK");
        }
    
        // Si se añade id en la URL se borrará dicha entrada
        const idToDelete = req.query.id;
        // Verificar si el ID es válido 
        if (isNaN(parseInt(idToDelete)) || parseInt(idToDelete) < 0) {
            return res.sendStatus(400, "BAD REQUEST");
        }
        const indexToDelete = datos_MRF.findIndex(gdp => gdp.id === parseInt(idToDelete));
    
        //Error si no existe dicho index
        if (indexToDelete === -1) {
            return res.sendStatus(404, "NOT FOUND");
        }
        // Eliminar el elemento 
        datos_MRF.splice(indexToDelete, 1);
        res.sendStatus(200, `Elemento con ID ${idToDelete} eliminado correctamente.`);
    });


    app.put(API_BASE + "/", (req, res) => {
        // Obtener el ID del parámetro de la URL
        const idToUpdate = req.query.id;
    
        // Obtener el objeto actualizado del cuerpo de la solicitud
        const updatedGDP = req.body;
    
        // Si se proporciona un ID en la URL, actualizar solo esa entrada
        if (idToUpdate) {
            // Verificar si el ID es válido (es un número entero positivo)
            if (isNaN(parseInt(idToUpdate)) || parseInt(idToUpdate) < 0 ) {
                // Si el ID no es válido, devolver un código de estado 400 (solicitud incorrecta)
                return res.sendStatus(404, "NOT FOUND");
            }

            if (updatedGDP.id && parseInt(updatedGDP.id) !== parseInt(idToUpdate)) {
                // Si el ID del objeto no coincide con el ID de la URL, devolver un código de estado 400
                return res.sendStatus(400, "BAD REQUEST");
            }
    
            // Buscar el índice del elemento con el ID proporcionado en datos_MRF
            const indexToUpdate = datos_MRF.findIndex(gdp => gdp.id === parseInt(idToUpdate));
    
            // Verificar si el elemento con el ID proporcionado existe en datos_MRF
            if (indexToUpdate === -1) {
                // Si no se encuentra el elemento, devolver un código de estado 404 (no encontrado)
                return res.sendStatus(404, "NOT FOUND");
            }
    
            // Actualizar el elemento en datos_MRF
            datos_MRF[indexToUpdate] = updatedGDP;
    
            // Enviar una respuesta con el vehículo actualizado
            return res.sendStatus(200, "OK").send(updatedGDP);
        } else {
            // Si no se proporciona un ID en la URL, error
            return res.sendStatus(405, "METHOD NOT ALLOWED");
        }
    });

}

module.exports.mrfv1 = API_MRF;




