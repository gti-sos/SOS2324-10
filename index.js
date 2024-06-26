console.log("Carga Index.js");

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



app.use(cors({
    "origin": "*",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}));



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

//Crear ruta estática para poder mostrar vídeos
app.use('/videos', express.static('videos'))


//Hacemos uso de proxy
app.use("/proxyTLR1", function (req, res) {
    console.log("/proxyTLR1 --> se accede a ruta");
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


            res.send(transformedData);
        }
    });
});



app.use("/proxyTLR2", function (req, res) {
    console.log("proxyTLR2 --> se accede a ruta");
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
    console.log("proxyTLR3 --> se accede a ruta");
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
    console.log("proxyTLR4 --> se accede a ruta");
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


/**
app.use("/proxyMRF1", function (req, res) {
    console.log("/proxyMRF1 --> se accede a ruta");
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
            //console.log(response.statusCode);

            res.send(body);
        }
    });

});*/

app.use("/proxyMRF1", function (req, res) {
    console.log("/proxyMRF1 --> se accede a ruta");
    const url = 'https://spotify23.p.rapidapi.com/concerts/';
    
    const options = {
        url: url,
        headers: {
            'X-RapidAPI-Key': '77e71d3380msh154aec6377535a9p1b8f1ajsnec607687032a',
            'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
        }
    };

    request(options, (error, response, body) => {
        if (error) {
            console.error(error);
            res.status(500).send(error);
        } else {
            try {
                const data = JSON.parse(body);
                // Obtener solo los primeros 21 objetos dentro de 'events'
                const events = (data.events || []).slice(0, 21);

                const filteredEvents = events.map(event => ({
                    venue: event.venue,
                    location: event.location
                }));

                res.json(filteredEvents);
            } catch (e) {
                console.error(e);
                res.status(500).send(e.toString());
            }
        }
    });
});

app.use("/proxyMRF2", function(req, res){
    console.log("/proxyMRF2 --> se accede a ruta");
    const url = 'https://deaths-by-european-countries.p.rapidapi.com/4mjf2k/deaths_by_country';
    
    const options = {
      url: url,
      headers: {
        'X-RapidAPI-Key': '77e71d3380msh154aec6377535a9p1b8f1ajsnec607687032a',
        'X-RapidAPI-Host': 'deaths-by-european-countries.p.rapidapi.com'
      }
    };

    request(options, (error, response, body) => {
        if (error) {
            console.error(error);
            res.status(500).send(error);
        } else {
            //console.log(response.statusCode);

            const data = JSON.parse(body);

            // Función para transformar los datos en el formato deseado
            const transformarDatos = (datos) => {
                const geo = datos["Country or Group"].toLowerCase();; // Cambiado a "geo"
                // Verificar si datos["2020"] es null o undefined antes de acceder a la propiedad replace
                const deaths_2020 = datos["2020"] !== null && datos["2020"] !== undefined ? parseInt(datos["2020"]) : undefined;
                return deaths_2020 !== undefined ? { geo, deaths_2020 } : null;
            };

            const transformedData = data.map(transformarDatos).filter(obj => obj !== null);

            res.send(transformedData);
        }
    });
    
});

app.use("/proxyMRF3", function(req, res){
    console.log("/proxyMRF3 --> se accede a ruta");
    const url = 'https://cancer-rates-by-usa-state.p.rapidapi.com/YDaHXO/cancer_rates_by_usa_state';
    
    const options = {
        url: url,
        headers: {
            'X-RapidAPI-Key': '77e71d3380msh154aec6377535a9p1b8f1ajsnec607687032a',
            'X-RapidAPI-Host': 'cancer-rates-by-usa-state.p.rapidapi.com'
        }
    };

    request(options, (error, response, body) => {
        if (error) {
            console.error(error);
            res.status(500).send(error);
        } else {
            console.log(response.statusCode);
            let data = JSON.parse(body);
            //console.log(data);
            res.send(data);
        }
    });
});


app.use("/proxyMRF4", function(req, res){
    console.log("/proxyMRF4 --> se accede a ruta");
    const url = 'https://everyearthquake.p.rapidapi.com/earthquakes?start=1&count=50&type=earthquake&latitude=37.2324&longitude=5.5924&radius=1000&units=miles&magnitude=3&intensity=1';
    
    const options = {
        url: url,
        headers: {
            'X-RapidAPI-Key': '1aadf5ce53msh199300bed84e271p129a87jsn45a312038c14',
            'X-RapidAPI-Host': 'everyearthquake.p.rapidapi.com'
        }
    };

    request(options, (error, response, body) => {
        if (error) {
            console.error(error);
            res.status(500).send(error);
        } else {
            console.log(response.statusCode);
            let data = JSON.parse(body);
            // Parsear los datos y extraer solo los atributos 'magnitude' y 'country'
            const earthquakesInfo = data.data.map(earthquake => ({
                magnitude: earthquake.magnitude,
                geo: earthquake.country
            })).filter(earthquake => earthquake.geo !== "");
            // Enviar los datos parseados como respuesta
            res.send(earthquakesInfo);
        }
    });
});



app.use("/proxyASC1", function (req, res) {
    console.log("/proxyASC1 --> se accede a ruta");
    const url = 'https://covid-19-statistics.p.rapidapi.com/reports?iso=ESP';
    const options = {
        url: url,
        headers: {
            'X-RapidAPI-Key': '85099dfe9emsh2e80361b8f26190p1f3cdejsnc4545794f7f2',
            'X-RapidAPI-Host': 'covid-19-statistics.p.rapidapi.com'
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
})

app.use("/proxyASC2", function (req, res) {
    console.log("/proxyASC2 --> se accede a ruta");
    const url = 'https://ski-resort-forecast.p.rapidapi.com/Jackson%20Hole/forecast?units=i&el=top';
    const options = {
        url: url,
        headers: {
            'X-RapidAPI-Key': '85099dfe9emsh2e80361b8f26190p1f3cdejsnc4545794f7f2',
            'X-RapidAPI-Host': 'ski-resort-forecast.p.rapidapi.com'
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
})

app.use("/proxyASC3", function (req, res) {
    console.log("/proxyASC3 --> se accede a ruta");
    const url = 'https://cheapshark-game-deals.p.rapidapi.com/games?title=batman&exact=0&limit=15';
    const options = {
        url: url,
        headers: {
            'X-RapidAPI-Key': '85099dfe9emsh2e80361b8f26190p1f3cdejsnc4545794f7f2',
            'X-RapidAPI-Host': 'cheapshark-game-deals.p.rapidapi.com'
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
})

app.use("/proxyASC4", function (req, res) {
    console.log("/proxyASC4 --> se accede a ruta");
    const url = 'https://gamerpower.p.rapidapi.com/api/filter?platform=epic-games-store.steam.android&type=game.loot';
    const options = {
        url:url,
        headers: {
            'X-RapidAPI-Key': '85099dfe9emsh2e80361b8f26190p1f3cdejsnc4545794f7f2',
            'X-RapidAPI-Host': 'gamerpower.p.rapidapi.com'
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
})



app.use("/proxyASB1", function (req, res) {
    console.log("/proxyASB1 --> se accede a ruta");
    const url = 'https://algobook-stock-api.p.rapidapi.com/api/v1/stocks?tickers=AMZN,AAPL,MSFT,GOOGL,KO,MCD';
    const options = {
        url: url,
        headers: {
            'X-RapidAPI-Key': '1ae5868997msh0a3205e591a7ed8p195ba3jsn5cbea63c1c53',
			'X-RapidAPI-Host': 'algobook-stock-api.p.rapidapi.com'
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
})


app.use("/proxyASB3", function (req, res) {
    console.log("/proxyASB3 --> se accede a ruta");
    const url = 'https://mineable-coins.p.rapidapi.com/coins';
    const options = {
        url: url,
        headers: {
            'X-RapidAPI-Key': '1ae5868997msh0a3205e591a7ed8p195ba3jsn5cbea63c1c53',
            'X-RapidAPI-Host': 'mineable-coins.p.rapidapi.com'
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
})

app.use("/proxyASB4", function (req, res) {
    console.log("/proxyASB4 --> se accede a ruta");
    const url = 'https://mmo-games.p.rapidapi.com/games';
    const options = {
        url: url,
        headers: {
            'X-RapidAPI-Key': '1ae5868997msh0a3205e591a7ed8p195ba3jsn5cbea63c1c53',
            'X-RapidAPI-Host': 'mmo-games.p.rapidapi.com'
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
})

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


