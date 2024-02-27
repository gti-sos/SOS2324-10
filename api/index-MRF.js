//let bodyParser = require("body-parser");
//app.use(bodyParser.json());
const datos_MRF = require('./index-MRF');
//API Miguel
export function loadAPI_MRF(app){
    app.get(API_BASE + "/gdp-growth-rates", (req, res) => {
        res.send(`<html><body><h1>https://data.europa.eu/data/datasets/1pdehxmf8q9yexgyf1pyhq?locale=en, https://data.europa.eu/data/datasets/jrc-luisa-lf113-b-gdp-capita-ref-2014?locale=en</h1></body></html>`);
    });
    
    app.get(API_BASE + "/gdp-growth-rates/loadInitialData", (req, res) => {
        res.send(JSON.stringify(datos_MRF));
    });
    
    app.post(API_BASE + "/gdp-growth-rates", (req, res) => {
        let growth = req.body;
        datos_MRF.push(growth);
        res.sendStatus(201, "Created");
    });
    
   /**  app.delete(API_BASE + "/gdp-growth-rates", (req, res) => {
        datos_MRF.remove({}, { multi: true }, (err, numRemoved) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ error: 'Internal server error' });
            }
            return res.status(200).send({ message: `Deleted ${numRemoved} gdp-growth-rates` });
        });
    });*/
    
};




