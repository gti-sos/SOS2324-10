import express from "express";
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



let app = express();
const PORT = process.env.PORT || 8080;
//Activar CORS
app.use(cors());


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





