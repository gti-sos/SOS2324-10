const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const API_BASE = "/api/v1"
app.use(bodyParser.json());
const datos = require('../index-ASB');


module.exports = (app) => {
    app.get(API_BASE + "/datosasb", (req, res) => {
        res.send(JSON.stringify(datos));
    });
};