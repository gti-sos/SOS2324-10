let cool = require("cool-ascii-faces");
let express = require("express");

let app = express();
const PORT = (process.env.PORT || 8080);
app.listen(PORT);

//Establecemos subdirectorios de la web
const path = require('path');
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use("/",express.static("./public"));

app.get("/cool", (req,res)=>{
    res.send(`<html><body><h1>${cool()}</h1></body></html>`)
});

console.log(`Server listening on port ${PORT}`);

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

app.get("/samples/TLR", (req,res)=>{
    const mediaMuertesPorPais = calcularMediasMuertesPorPais(datos_TLR); 
    const mediaMuertesJSON = JSON.stringify(mediaMuertesPorPais);
    res.send(`<html> <body> ${mediaMuertesJSON} </body> </html>`)
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
