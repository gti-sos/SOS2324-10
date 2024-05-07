import express, { response } from "express";
import bodyParser from "body-parser";

import { API_TLR_v1 } from "./api/api-TLR-v1.js";
import { API_TLR_v2 } from "./api/api-TLR-v2.js";
import { backend_MRF_v1 } from "./api/api-MRF_v1.js";
import { backend_MRF_v2 } from "./api/api-MRF_v2.js";
import { API_ASC_v1 } from "./api/api-ASC_v1.js";
import { API_ASC_v2 } from "./api/api-ASC_v2.js";
import { API_ASB_v1 } from "./api/api-ASB_v1.js";
import { API_ASB_v2 } from "./api/api-ASB_v2.js";

//neDB
import dataStore from "nedb";
let db_TLR = new dataStore();
let db_ASC = new dataStore();
let db_MRF = new dataStore();
let db_ASB = new dataStore();

//Adaptador Svelte
import { handler } from "./front/build/handler.js";
import cors from "cors";
import request from "request";



let app = express();
const PORT = process.env.PORT || 8080;

//Activar CORS 
const whitelist = [
    'http://127.0.0.1:8080',
    'https://car-api2.p.rapidapi.com/api/vin/1GTG6CEN0L1139305'
];

app.use(cors());
/*
app.use(cors({
    "origin": "*",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}));
*/


app.listen(PORT);
app.use(bodyParser.json());

API_TLR_v1(app, db_TLR);
API_TLR_v2(app, db_TLR);
backend_MRF_v1(app, db_MRF);
backend_MRF_v2(app, db_MRF);
API_ASC_v1(app, db_ASC);
API_ASC_v2(app, db_ASC);
API_ASB_v1(app, db_ASB);
API_ASB_v2(app, db_ASB);

//Hacemos uso de proxy
app.use("/proxyTLR1", function (req, res) {
    const url = 'https://streaming-availability.p.rapidapi.com/countries';
    const options = {
        url: url,
        headers: {
            'X-RapidAPI-Key': '1aadf5ce53msh199300bed84e271p129a87jsn45a312038c14',
            'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
        }
    };

    request(options, (error, response, body) => {
        if (error) {
            console.error(error);
            res.status(500).send(error);
        } else {
            console.log(response.statusCode);

            // Parse the body to a JavaScript object
            let data = JSON.parse(body);

            // Transform the data to the desired format
            let transformedData = Object.keys(data.result).map(countryCode => {
                let countryData = data.result[countryCode];
                let services = Object.values(countryData.services).map(service => service.name);
                return {
                    geo: countryData.name,
                    services: services
                };
            });

            console.log(transformedData);
            res.send(transformedData);
        }
    });
});



app.use("/proxyTLR2", function (req, res) {
    const url = 'https://covid-193.p.rapidapi.com/statistics';
    const options = {
        url: url,
        headers: {
            'X-RapidAPI-Key': '1aadf5ce53msh199300bed84e271p129a87jsn45a312038c14',
            'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
        }
    };

    request(options, (error, response, body) => {
        if (error) {
            console.error(error);
            res.status(500).send(error);
        } else {
            console.log(response.statusCode);

            // Parse the body to a JavaScript object
            let data = JSON.parse(body);

            // Transform the data to only include 'country' and 'deaths.total'
            let transformedData = data.response.map(item => {
                return {
                    geo: item.country,
                    deaths: item.deaths.total
                };
            });

            // Send the transformed data
            res.send(transformedData);
        }
    });
});

app.use("/proxyTLR3", function (req, res) {
    const url = 'https://restcountries.com/v3.1/all';
    const options = {
        url: url
    };

    request(options, (error, response, body) => {
        if (error) {
            console.error(error);
            res.status(500).send(error);
        } else {
            console.log(response.statusCode);
            let data = JSON.parse(body);
            let modifiedData = data.map(country => {
                let currencyName = country.currencies ? Object.values(country.currencies)[0].name : null;
                return {
                    geo: country.name.common,
                    currency: currencyName
                };
            });
            res.send(modifiedData);
        }
    });
});

app.use("/proxyTLR4", function (req, res) {
    const url = 'https://free-to-play-games-database.p.rapidapi.com/api/games';
    const options = {
        url: url,
        headers: {
            'X-RapidAPI-Key': '1aadf5ce53msh199300bed84e271p129a87jsn45a312038c14',
            'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com'
        }
    };

    request(options, (error, response, body) => {
        if (error) {
            console.error(error);
            res.status(500).send(error);
        } else {
            console.log(response.statusCode);

            // Parse the body to a JavaScript object
            let data = JSON.parse(body);

            // Transform the data to only include 'title', 'genre', and 'platform'
            let transformedData = data.map(item => {
                return {
                    title: item.title,
                    genre: item.genre,
                    platform: item.platform
                };
            });

            // Send the transformed data
            res.send(transformedData);
        }
    });
});



app.use("/proxyMRF1", function(req,res){

    const url = 'https://beers-list.p.rapidapi.com/beers';
    
    const options = {
      url: url,
      headers: {
        'X-RapidAPI-Key': '77e71d3380msh154aec6377535a9p1b8f1ajsnec607687032a',
        'X-RapidAPI-Host': 'beers-list.p.rapidapi.com'
      }
    };

    request(options, (error, response, body) => {
        if (error) {
            console.error(error);
            res.status(500).send(error);
        } else {
            console.log(response.statusCode);
            console.log(body);
            res.send(body);
        }
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





