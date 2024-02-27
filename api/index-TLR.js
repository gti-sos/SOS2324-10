let express = require("express");
let app = express();

let bodyParser = require("body-parser");
app.use(bodyParser.json());

const datos_TLR = require('./index-TLR');
//API Tomás
function loadAPI_TLR(app) {
    app.get(API_BASE + "/vehicles-stock", (req, res) => {
        res.send(`<html><body><h1>https://data.europa.eu/data/datasets/nhmove15jqyapyxty0rpjw?locale=es</h1></body></html>`);
    });

    app.get(API_BASE + "/vehicles-stock/loadInitialData", (req, res) => {
        res.send(JSON.stringify(datos_TLR));
    });

    app.post(API_BASE + "/vehicles-stock", (req, res) => {
        let vehicle = req.body;
        datos_TLR.push(vehicle);
        res.sendStatus(201, "Created");
    });

    /**app.delete(API_BASE + "/vehicles-stock/loadInitialData", (req, res) => {
        datos_TLR.remove({}, { multi: true }, (err, numRemoved) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ error: 'Internal server error' });
            }
            return res.status(200).send({ message: `Deleted ${numRemoved} vehicles-stock` });
        });
    });*/
    app.delete(API_BASE + "/vehicles-stock/loadInitialData", (req, res) => {
        // Lógica para eliminar los datos_TLR, por ejemplo:
        datos_TLR.splice(0, datos_TLR.length); // Elimina todos los elementos del array
        res.status(200).send({ message: `Deleted all vehicles-stock` });
    });

};

export {loadAPI_TLR}


