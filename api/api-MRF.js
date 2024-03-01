const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const API_BASE = "/api/v1"
app.use(bodyParser.json());
const datos_MRF = require('./../index-MRF');

//API Miguel
module.exports = (app) => {
    app.get(API_BASE + "/gdp-growth-rates", (req, res) => {
        res.send(`<html><body><h1>https://data.europa.eu/data/datasets/1pdehxmf8q9yexgyf1pyhq?locale=en, https://data.europa.eu/data/datasets/jrc-luisa-lf113-b-gdp-capita-ref-2014?locale=en</h1></body></html>`);
        res.send(JSON.stringify(datos_MRF));
        res.sendStatus(200, "Ok")
    });
    
    app.get(API_BASE + "/gdp-growth-rates/loadInitialData", (req, res) => {
        if(datos_MRF == null)
            res.send(JSON.stringify(datos_MRF));
            res.sendStatus(200, "Ok")
    });


    app.post(API_BASE + "/gdp-growth-rates", (req, res) => {
        const newGDP = req.body;
        //Verificamos que no exista un elemento con el mismo id
        const duplicateId = datos_MRF.some(gdp => gdp.id === newGDP.id);
        if (duplicateId) {
            //Si hay elemento con mismo id, devolver error
            return res.sendStatus(409).send("Ya existe una entrada con ese id");
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
        //Mensaje de 201 OK
        res.sendStatus(200, "Created");
    });

    
   
    app.delete(API_BASE + "/gdp-growth-rates", (req, res) => {
        // Si no se añade id en la URL se borrarán todas las entradas
        if (!req.query.id) {
            datos_TLR.splice(0, datos_TLR.length);
            return res.senStatus(200, "Entradas eliminadas correctamente");
        }
    
        // Si se añade id en la URL se borrará dicha entrada
        const idToDelete = req.query.id;
        // Verificar si el ID es válido 
        if (isNaN(parseInt(idToDelete)) || parseInt(idToDelete) < 0) {
            return res.sendStatus(400, "Inserte un id válido, únicamente valores numéricos");
        }
        const indexToDelete = datos_MRF.findIndex(gdp => gdp.id === parseInt(idToDelete));
    
        //Error si no existe dicho index
        if (indexToDelete === -1) {
            return res.sendStatus(404, "Elemento no encontrado");
        }
        // Eliminar el elemento 
        datos_MRF.splice(indexToDelete, 1);
        res.status(200).send({ message: `Elemento con ID ${idToDelete} eliminado correctamente.` });
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
                return res.sendStatus(400).send({message:"Elemento no encontrado"});
            }

            if (updatedGDP.id && parseInt(updatedGDP.id) !== parseInt(idToUpdate)) {
                // Si el ID del objeto no coincide con el ID de la URL, devolver un código de estado 400
                return res.sendStatus(400).send({message:"Los IDs no coinciden"});
            }
    
            // Buscar el índice del elemento con el ID proporcionado en datos_MRF
            const indexToUpdate = datos_MRF.findIndex(gdp => gdp.id === parseInt(idToUpdate));
    
            // Verificar si el elemento con el ID proporcionado existe en datos_MRF
            if (indexToUpdate === -1) {
                // Si no se encuentra el elemento, devolver un código de estado 404 (no encontrado)
                return res.sendStatus(404).send({message:"Elemento no encontrado"});
            }
    
            // Actualizar el elemento en datos_MRF
            datos_MRF[indexToUpdate] = updatedGDP;
    
            // Enviar una respuesta con el vehículo actualizado
            return res.status(200).send({message:"Elemento modificado"}).send(updatedGDP);
        } else {
            // Si no se proporciona un ID en la URL, actualizar todas las entradas
            return res.sendStatus(405, "Método no permitido para todos los datos");
        }
    });
};




