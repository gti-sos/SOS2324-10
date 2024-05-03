import express, { response } from "express";
import bodyParser from "body-parser";

import {API_TLR_v1} from "./api/api-TLR-v1.js";
import {API_TLR_v2} from "./api/api-TLR-v2.js";
import {backend_MRF_v1} from "./api/api-MRF_v1.js";
import {backend_MRF_v2} from "./api/api-MRF_v2.js";
import {API_ASC_v1} from "./api/api-ASC_v1.js";
import {API_ASC_v2} from "./api/api-ASC_v2.js";
import {API_ASB_v1} from "./api/api-ASB_v1.js";
import {API_ASB_v2} from "./api/api-ASB_v2.js";

//neDB
import dataStore from "nedb";
let db_TLR = new dataStore();
let db_ASC = new dataStore();
let db_MRF = new dataStore();
let db_ASB = new dataStore();

//Adaptador Svelte
import {handler} from "./front/build/handler.js";
import cors from "cors";
import request from "request";



let app = express();
const PORT = process.env.PORT || 8080;

//Activar CORS 
const whitelist = [
    'http://127.0.0.1:8080',
    'https://car-api2.p.rapidapi.com/api/vin/1GTG6CEN0L1139305'
];

app.use(cors({
    "origin": function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}));



app.listen(PORT);
app.use(bodyParser.json());

API_TLR_v1(app,db_TLR);
API_TLR_v2(app,db_TLR);
backend_MRF_v1(app, db_MRF);
backend_MRF_v2(app, db_MRF);
API_ASC_v1(app, db_ASC);
API_ASC_v2(app, db_ASC);
API_ASB_v1(app, db_ASB);
API_ASB_v2(app, db_ASB);

//Hacemos uso de proxy
app.use("/proxyTLR", function(req,res){
    var url = "https://sos2324-10.appspot.com/api/v2/vehicles-stock";
    console.log('piped' + req.url);

    request(url, (error, response, body)=> {
        if(error){
            console.log(error);
        }
        console.log(response.statusCode);
        console.log(body);
        res.send(body);
    });    
});

//Uso del handler
app.use(handler);

// Establecemos subdirectorios de la web
import path from "path";
//const path = require('path');
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use("/", express.static("./public"));
console.log(`Server listening on port ${PORT}`);





