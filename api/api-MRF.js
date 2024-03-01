//const bodyParser = require("body-parser");
//const express = require("express");
//const app = express();
import Datastore from "nedb";
var db = new Datastore();

const API_BASE = "/api/v1"
//app.use(bodyParser.json());
//const datos_MRF = require('./../index-MRF');


//API Miguel
//module.exports = (app) => {

function loadBackend_MRF(app){

    var datos = [

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
    ]

    db.insert(datos);
    console.log("New GET to /data")

// -------------------------------- GET -------------------------------------
   

    // Carga inicial de datos

    app.get(API_BASE + "/gdp-growth-rates/loadInitialData", (req, res) => {
        db.find({}, (err, dato) => {
            if (dato.length > 0) {
                res.json("Los datos ya se han cargado");
                console.log("Los datos ya se han cargado");
            } else if (err) {
                res.sendStatus(500);
                console.log("Error al cargar los datos");
            } else {
                db.insert(datos);
                console.log("Se han insertado los datos");
                res.sendStatus(200);
            }
        });
    });

    // GET ruta generica
    app.get(API_BASE + "/gdp-growth-rates", (req, res) => {
        db.find({}, {_id: 0}, (err, filteredList) => {
            // Comprobamos los errores que han podido surgir
            if(err){
                console.log(`Error getting gdp`);
                // El estado es el 500 de Internal Server Error
                res.sendStatus(500);
            // Comprobamos si existen datos:
            }else{
                // Tenemos que inicializar los valores necesarios para filtrar: tenemos que ver el limit y offset
                let i = -1;
                if(!req.query.offset){ 
                  var offset = -1;
                }else{ 
                  var offset = parseInt(req.query.offset);
                }
                // Tenemos que filtrar los datos, para ver cada posible campo y devolver true si no se pasa en la query, 
                // y si es un parámetro en la query se comprueba la condicion
                let campos = filteredList.filter((x) => {
                    return (((req.query.dataflow == undefined)||(parseInt(req.query.dataflow) === x.dataflow))&&
                    ((req.query.last_update == undefined)||(req.query.last_update) === x.last_update)&&
                    ((req.query.frequency == undefined)||(parseInt(req.query.frequency) <= x.frequency))&&
                    ((req.query.unit == undefined)||(parseInt(req.query.unit) >= x.unit))&&
                    ((req.query.na_item == undefined)||(req.query.province === x.na_item))&&
                    ((req.query.geo == undefined)||(parseFloat(req.query.geo) <= x.geo))&&
                    ((req.query.time_period == undefined)||(parseFloat(req.query.time_period) >= x.time_period))&&
                    ((req.query.obs_value == undefined)||(parseFloat(req.query.obs_value) <= x.obs_value))&&
                    ((req.query.growth_rate_2030 == undefined)||(parseFloat(req.query.growth_rate_2030) >= x.growth_rate_2030))&&
                    ((req.query.growth_rate_2040 == undefined)||(parseFloat(req.query.growth_rate_2040) <= x.growth_rate_2040)));

                }).filter((x) => {
                    // La paginación
                    i = i+1;
                    if(req.query.limit==undefined){ 
                      var cond = true;
                    }else{ 
                      var cond = (parseInt(offset) + parseInt(req.query.limit)) >= i;
                    }
                    return (i > offset) && cond;
                });
    
                // Comprobamos si tras el filtrado sigue habiendo datos, si no hay:
            if(campos.length == 0){
                console.log(`GDP not found`);
                  // Estado 404: Not Found
                  response.status(404).json(campos);
    
              // Si por el contrario encontramos datos
            }else{
                console.log(`Datos de gdp devueltos: ${campos.length}`);
                // Devolvemos dichos datos, estado 200: OK
                response.json(campos);
    
            }  
        }
    })
        
        console.log("GET con los datos");
    });

    function pagination(req, lista){
      var res = [];
      const limit = req.query.limit;
      const offset = req.query.offset;
      
      if(limit < 1 || offset < 0 || offset > lista.length){
          res.push("Hay un error en los parametros offset y limit");
          return res;
      }else{
      res = lista.slice(offset,parseInt(limit)+parseInt(offset));
      return res;
      }     
    };
    
   


// -------------------------------------- POST -----------------------------

    app.post(API_BASE + "/gdp-growth-rates", (req, res) => {
        const newGDP = req.body;
        //Verificamos que no exista un elemento con el mismo id
        const duplicateId = datos_MRF.some(gdp => gdp.id === newGDP.id);
        if (duplicateId) {
            //Si hay elemento con mismo id, devolver error
            return res.sendStatus(409, "CONFLICT");
        }
        //Función para agragar id si no tiene
        if (!newGDP.id) {
            if (datos_MRF.length === 0) {
                newGDP.id = 1; 
            } else {
                const lastId = datos_MRF[datos_MRF.length - 1].id;
                newGDP.id = parseInt(lastId) + 1;
            }
        }
        datos_MRF.push(newGDP);

        res.sendStatus(201, "Created");
    });

    
   
    app.delete(API_BASE + "/gdp-growth-rates", (req, res) => {
        // Si no se añade id en la URL se borrarán todas las entradas
        if (!req.query.id) {
            datos_MRF.splice(0, datos_MRF.length);
            return res.sendStatus(200, "Entradas eliminadas correctamente");
        }
    
        // Si se añade id en la URL se borrará dicha entrada
        const idToDelete = req.query.id;
        // Verificar si el ID es válido 
        if (isNaN(parseInt(idToDelete)) || parseInt(idToDelete) < 0) {
            return res.sendStatus(400, "BAD req");
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


    app.put(API_BASE + "/gdp-growth-rates", (req, res) => {
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
                return res.sendStatus(400, "BAD req");
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
            // Si no se proporciona un ID en la URL, actualizar todas las entradas
            return res.sendStatus(405, "METHOD NOT ALLOWED");
        }
    });

};




