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