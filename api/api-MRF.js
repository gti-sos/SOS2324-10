const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const API_BASE = "/api/v1"
app.use(bodyParser.json());
const datos_MRF = require('./../index-MRF');

//API Miguel
module.exports = (app) => {

// -------------------------------- GET -------------------------------------
   
    app.get(API_BASE + "/gdp-growth-rates", (req, res) => {
        const query = req.query;

        if (Object.keys(query).length === 0) {

            console.log("New request to /gdp-frowth-rates");
            datos_MRF.find({}, (err, arrayDatos) => {
                if (err) {
                    console.log(`Error getting /gdp-frowth-rates: ${err}`);
                    res.sendStatus(500, "Error interno del servidor");
                } else {
                    console.log(`Returned ${arrayDatos.length}`);
                    const datosSinId = arrayDatos.map((n) => {
                        delete n._id;
                        return n;
                    });
                    res.status(200).json(datosSinId);
                }
            });
        } else if(req.query.offset || req.query.limit){
            const { offset, limit } = req.query;
            console.log(`New request to /gdp-frowth-rates?offset="${offset}"&limit="${limit}"`);
            if (!offset || !limit) {
                return res.status(400).send('faltan parametros requeridos');
            } else {
                const startIndex = parseInt(offset);
                const endIndex = parseInt(offset) + parseInt(limit);

                ddbb.find({}, (err, docs) => {
                    if (err) {
                        res.status(500).send('Error retrieving data from database');
                    } else if(offset < 0 || offset > limit || offset > docs.length || limit < 0 || limit > docs.length){
                        res.status(400).send('Bad request');
                    } else {
                        const data = docs.slice(startIndex,endIndex);
                        data.map((n) => {
                            delete n._id;
                            return n;
                        });
                        if(data.length == 1){
                            res.send(data[0]);
                        }else{
                            res.send(data);    
                        }  
                    }
                });
            }
        }
    });
    
    app.get(API_BASE + "/gdp-growth-rates/loadInitialData", (req, res) => {
        datos_MRF.find({}, (err, dato) => {
            if (err) {
                console.log(`error geting /gdp-growth-rates: ${err}`);
                response.sendStatus(500);
            } else if (dato.length === 0) {
                for (var i = 0; i < datos_MRF.length; i++) {
                    ddbb.insert(datos_MRF[i]);
                }
                response.sendStatus(201);
                console.log("se han cargado los datos iniciales");
            } else {
                response.status(409).send("ya existen los datos");
                console.log(`existen ${dato.length} datos`);
            }
        }
        );
    });


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
            // Si no se proporciona un ID en la URL, actualizar todas las entradas
            return res.sendStatus(405, "METHOD NOT ALLOWED");
        }
    });
};




