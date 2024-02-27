let cool = require("cool-ascii-faces");
let express = require("express");
let bodyParser = require("body-parser");

let app = express();
const PORT = (process.env.PORT || 8080);
app.listen(PORT);

//Establecemos subdirectorios de la web
const path = require('path');
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use("/", express.static("./public"));

app.get("/cool", (req, res) => {
    res.send(`<html><body><h1>${cool()}</h1></body></html>`)
});

console.log(`Server listening on port ${PORT}`);

//API Global
const API_BASE = "/api/v1";
app.use(bodyParser.json());

//API Tomás
app.get(API_BASE + "/vehicles-stock/loadInitialData", (req, res) => {
    res.send(JSON.stringify(datos_TLR));
});

app.post(API_BASE + "/vehicles-stock", (req, res) => {
    let vehicle = req.body;
    datos_TLR.push(vehicle);
    res.sendStatus(201, "Created");
});

app.delete(API_BASE + "/vehicles-stock", (req, res) => {
    datos_TLR.remove({}, { multi: true }, (err, numRemoved) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ error: 'Internal server error' });
        }
        return res.status(200).send({ message: `Deleted ${numRemoved} vehicles-stock` });
    });
});

//API Miguel
app.get(API_BASE + "/gdp-growth-rates/loadInitialData", (req, res) => {
    res.send(JSON.stringify(datos_MRF));
});

app.post(API_BASE + "/gdp-growth-rates", (req, res) => {
    let growth = req.body;
    datos_MRF.push(growth);
    res.sendStatus(201, "Created");
});

app.delete(API_BASE + "/gdp-growth-rates", (req, res) => {
    datos_MRF.remove({}, { multi: true }, (err, numRemoved) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ error: 'Internal server error' });
        }
        return res.status(200).send({ message: `Deleted ${numRemoved} gdp-growth-rates` });
    });
});








//Función index-TLR.js
const datos_TLR = require('./index-TLR');
function calcularMediasMuertesPorPais(datos_TLR) {
    const muertesPorPais = {};
    datos_TLR.forEach((dato) => {
        const pais = dato.geo;
        const muertes = dato.cars_deaths;
        if (!muertesPorPais[pais]) {
            muertesPorPais[pais] = { totalMuertes: 0, conteo: 0 };
        }
        muertesPorPais[pais].totalMuertes += muertes;
        muertesPorPais[pais].conteo++;
    });

    const mediaMuertesPorPais = {};
    for (const pais in muertesPorPais) {
        const totalMuertes = muertesPorPais[pais].totalMuertes;
        const conteo = muertesPorPais[pais].conteo;
        mediaMuertesPorPais[pais] = totalMuertes / conteo;
    }

    return mediaMuertesPorPais;
}

app.get("/samples/TLR", (req, res) => {
    const mediaMuertesPorPais = calcularMediasMuertesPorPais(datos_TLR);
    const mediaMuertesJSON = JSON.stringify(mediaMuertesPorPais);
    res.send(`<html> <body> ${mediaMuertesJSON} </body> </html>`)
});

//Funcion index-MRF.js
const datos_MRF = require('./index-MRF');
function previsionPIBporGeo(datos_MRF) {
    let mediasPorPais = {};
    datos_MRF.forEach((dato) => {
        let geo = dato.geo;
        let crecimiento = dato.growth_rate_2030;
        if (!mediasPorPais[geo]) {
            mediasPorPais[geo] = {
                totalCrecimiento: 0,
                contador: 0
            };
        }
        mediasPorPais[geo].totalCrecimiento += crecimiento;
        mediasPorPais[geo].contador++;
    });

    for (let pais in mediasPorPais) {
        let media = mediasPorPais[pais].totalCrecimiento / mediasPorPais[pais].contador;
        mediasPorPais[pais].media = media;
        mediasPorPais[pais].mensaje = "La media de crecimiento para 2030 en " + pais + " es: " + media.toFixed(1) + " millones de euros";
    }
    return mediasPorPais;
}

app.get("/samples/MRF", (req, res) => {
    const mediasPorPais = previsionPIBporGeo(datos_MRF);
    const mediaPIBJSON = JSON.stringify(mediasPorPais);
    res.send(`<html> <body> ${mediaPIBJSON} </body> </html>`)
});


//Función index-ASC.js
const csv = require('./index-ASC');
function calcularMediaObsValuePorPais(csv) {
    let mediasPais = {};
    csv.forEach((n) => {
        let pais = n.get('geo');
        let obsValue = parseInt(n.get('obs_value'));
        if (!mediasPais[pais]) {
            mediasPais[pais] = {
                totalObsValue: 0,
                cont: 0
            };
        }
        mediasPais[pais].totalObsValue += obsValue;
        mediasPais[pais].cont++;
    });
    for (let pais in mediasPais) {
        let media = mediasPais[pais].totalObsValue / mediasPais[pais].cont;
        mediasPais[pais].media = media;
        mediasPais[pais].mensaje = "La media de coches vendidos en " + pais + " es: " + media.toFixed(1) + " coches";
    }
    return mediasPais;
}

app.get("/samples/ASC", (req, res) => {
    let mediasObsValuePorPais = calcularMediaObsValuePorPais(csv);
    let htmlResponse = "<html><body><ul>";

    for (let pais in mediasObsValuePorPais) {
        htmlResponse += `<li>${mediasObsValuePorPais[pais].mensaje}</li>`;
    }

    htmlResponse += "</ul></body></html>";

    res.send(htmlResponse);
})
//Funcion ASB
const data = require('./index-ASB');
function calcularPorcentajeMuertosPorKilometro(datos) {
    let aux = new Map();

    datos.forEach(obj => {
        let pais = obj.get('geo');
        let muertos = parseFloat(obj.get('road_deaths_per_million_inhabitants'));
        let kilometros = parseFloat(obj.get('millions_of_passenger_per_kilometres'));

        if (aux.has(pais)) {
            let promedioAnterior = aux.get(pais);
            let promedioMuertos = (promedioAnterior.muertos * promedioAnterior.contador + muertos) / (promedioAnterior.contador + 1);
            let promedioKm = (promedioAnterior.kilometros * promedioAnterior.contador + kilometros) / (promedioAnterior.contador + 1);
            aux.set(pais, { muertos: promedioMuertos, kilometros: promedioKm, contador: promedioAnterior.contador + 1 });
        } else {
            aux.set(pais, { muertos: muertos, kilometros: kilometros, contador: 1 });
        }
    });

    let resultados = {};
    aux.forEach((valor, clave) => {
        resultados[clave] = (valor.muertos / valor.kilometros) * 100;
    });

    return resultados;
}

app.get("/samples/ASB", (req, res) => {
    const porcentajeMuertos = calcularPorcentajeMuertosPorKilometro(data);
    const porcentajeMuertosJSON = JSON.stringify(porcentajeMuertos);
    res.send(`<html> <body> ${porcentajeMuertosJSON} </body> </html>`)
});




