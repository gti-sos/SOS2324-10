const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const API_BASE = "/api/v1"
app.use(bodyParser.json());
const csv = require('../index-ASC');


module.exports = (app) => {
    app.get(API_BASE + "/datosasc", (req, res) => {
        res.send(JSON.stringify(csv));
    });
};