//const cool = require("cool-ascii-faces");
const express = require("express");
const bodyParser = require("body-parser");
let API_TLR = require("./api/api-TLR");
let API_MRF = require("./api/api-MRF");
let API_ASC = require("./api/api-ASC");
let API_ASB = require("./api/api-ASB");
//neDB
let dataStore = require("nedb");
let db_TLR = new dataStore();
let db_ASC = new dataStore();
let db_MRF = new dataStore();
let db_ASB = new dataStore();

const app = express();
const PORT = process.env.PORT || 8080;

app.listen(PORT);
app.use(bodyParser.json());

const API_BASE = "/api/v1";


API_TLR(app,db_TLR);
API_MRF(app, db_MRF);
API_ASC(app, db_ASC);
API_ASB(app, db_ASB);

// Establecemos subdirectorios de la web
const path = require('path');
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use("/", express.static("./public"));
console.log(`Server listening on port ${PORT}`);





