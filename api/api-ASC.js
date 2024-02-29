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

    app.get(API_BASE + "/datosasc/loadInitialData", (req, res) => {
        if(csv == null){
            res.send(JSON.stringify(csv));
        }
    });

    app.post(API_BASE + "/datosasc", (req, res) => {
        let growth = req.body;
        csv.push(growth);
        res.sendStatus(201, "Created");
    });
    
    app.delete(API_BASE + "/datosasc", (req, res) => {
        csv.splice(0, csv.length); 
        res.sendStatus(200,"Deleted all -> Datos ASC");
    }); 
};