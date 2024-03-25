import express from "express";
import bodyParser from "body-parser";

import {API_TLR} from "./api/api-TLR.js";
import {backend_MRF_v1} from "./api/api-MRF_v1.js";
import {backend_MRF_v2} from "./api/api-MRF_v2.js";
import {API_ASC} from "./api/api-ASC.js";
//let API_ASB = require("./api/api-ASB");

//neDB
import dataStore from "nedb";
let db_TLR = new dataStore();
let db_ASC = new dataStore();
let db_MRF = new dataStore();
let db_ASB = new dataStore();

//Adaptador Svelte
import {handler} from "./front/build/handler.js";
import cors from "cors";



let app = express();
const PORT = process.env.PORT || 8080;
//Activar CORS
app.use(cors());

app.use(cors());

app.listen(PORT);
app.use(bodyParser.json());


API_TLR(app,db_TLR);
backend_MRF_v1(app, db_MRF);
backend_MRF_v2(app, db_MRF);
API_ASC(app, db_ASC);
//API_ASB(app, db_ASB);

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





