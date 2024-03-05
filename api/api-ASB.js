const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const API_BASE = "/api/v1"
app.use(bodyParser.json());
const datos = require('../index-ASB');


module.exports = (app) => {
    //GET
    app.get(API_BASE + "/cars-by-motor", (req, res) => {
        res.send(JSON.stringify(datos));
    });
    app.get(API_BASE + "/cars-by-motor/loadInitialDatos", (req, res) => {
        if (datos.length === 0) {
            for (let i = 0; i < datosBU.length; i++) {
                datos.push(datosBU[i]);
            }
            res.sendStatus(201, "CREATED");
        } else {
            res.sendStatus(405, "YA HAY DATOS CARGADOS");
        }
    });
    app.get(API_BASE + "/cars-by-motor/:geo", (req, res) => {
        const pais = req.params.geo;
        const restr = datos.filter(n => n.geo === pais);

        if (restr.length > 0) {
            res.send(JSON.stringify(restr));
            res.sendStatus(200, "OK");
        } else {
            res.sendStatus(404, "NOT FOUND");
        }

    });
    //POST
    app.post(API_BASE + "/cars-by-motor", (req, res) => {
        let data = req.body;
    
        // Verificar si el body es un JSON válido y tiene la estructura esperada
        const structure = {
            'id':'number',
            'dataflow': 'string',
            'last_update': 'string',
            'freq': 'string',
            'unit': 'string',
            'mot_nrg': 'string',
            'geo': 'string',
            'time_period': 'number',
            'obs_value': 'number',
            'obs_flag': 'string',
            'millions_of_passenger_per_kilometres': 'number',
            'road_deaths_per_million_inhabitants': 'number'
        };
    
        const actualKeys = Object.keys(data);
        const expectedKeys = Object.keys(structure);
        const isValidJson = expectedKeys.every(key => actualKeys.includes(key) && typeof data[key] === structure[key]);
    
        if (!isValidJson || actualKeys.length !== expectedKeys.length) {
            // El JSON no tiene la estructura esperada
            res.status(400).send("Bad Request: JSON has invalid structure");
        } else if (datos.some(entry => entry.id === data.id)) {
            // El recurso ya existe, devolver error 409
            res.status(409).send("Conflict: Resource already exists");
        } else {
            // El recurso no existe, agregarlo a datos
            datos.push(datos);
            res.status(201).send("Created");
        }
    });
    //PUT
    app.put(API_BASE + "/cars-by-motor/:geo", (req, res) => {

        const pais = req.params.geo;
        let data = req.body;
        const filtro = datos.findIndex(dato => dato.geo === pais);

        if (filtro.length === 0) {
            res.sendStatus(404, "NOT FOUND");
        } else {
            for (let i = 0; i < datos.length; i++) {
                if (datos[i].geo === pais) {
                    datos[i] = data;
                }
            }
            res.sendStatus(200, "OK");
        }
    });

    app.put(API_BASE + "/cars-by-motor", (req, res) => {
        res.sendStatus(405, "METHOD NOT ALLOWED");
    });
    //DELETE
    app.delete(API_BASE + "/cars-by-motor", (req, res) => {
        datos.splice(0, datos.length);
        res.sendStatus(200, "Deleted all -> Datos ASB");
    });
    app.delete(API_BASE + "/cars-by-motor/:geo", (req, res) => {
        const geoToDelete = req.params.geo;
    
        // Filtrar los datos que coincidan con la edad especificada
        const newData = datos.filter(entry => entry.geo !== geoToDelete);
    
        // Verificar si se eliminaron datos
        if (newData.length < datos.length) {
            // Se eliminaron datos, actualizar datos
            datos.splice(0, datos.length, ...newData);
            res.status(200).send("Deleted data with geo: " + geoToDelete);
        } else {
            // No se encontraron datos con esa edad
            res.status(404).send("Not Found: No data found with geo " + geoToDelete);
        }
    });
    
    // Manejar todos los otros métodos no permitidos
    app.all(API_BASE + "/cars-by-motor/*", (req, res) => {
        res.sendStatus(405);
    });

    let backup_datos = [
        {
          dataflow: 'ESTAT:ROAD_EQS_CARPDA(1.0)',
          last_update: '16/01/24 23:00:00',
          freq: 'A',
          unit: 'NR',
          mot_nrg: 'ALT',
          geo: 'AT',
          time_period: 2015,
          obs_value: 10125,
          obs_flag: '',
          millions_of_passenger_per_kilometres: 90630,
          road_deaths_per_million_inhabitants: 479
        },
        {
          dataflow: 'ESTAT:ROAD_EQS_CARPDA(1.0)',
          last_update: '16/01/24 23:00:00',
          freq: 'A',
          unit: 'NR',
          mot_nrg: 'ALT',
          geo: 'AT',
          time_period: 2016,
          obs_value: 14459,
          obs_flag: '',
          millions_of_passenger_per_kilometres: 93090,
          road_deaths_per_million_inhabitants: 432
        },
        {
          dataflow: 'ESTAT:ROAD_EQS_CARPDA(1.0)',
          last_update: '16/01/24 23:00:00',
          freq: 'A',
          unit: 'NR',
          mot_nrg: 'ALT',
          geo: 'AT',
          time_period: 2017,
          obs_value: 20180,
          obs_flag: '',
          millions_of_passenger_per_kilometres: 94757,
          road_deaths_per_million_inhabitants: 414
        },
        {
          dataflow: 'ESTAT:ROAD_EQS_CARPDA(1.0)',
          last_update: '16/01/24 23:00:00',
          freq: 'A',
          unit: 'NR',
          mot_nrg: 'ALT',
          geo: 'BE',
          time_period: 2013,
          obs_value: 18859,
          obs_flag: '',
          millions_of_passenger_per_kilometres: 132615,
          road_deaths_per_million_inhabitants: 764
        },
        {
          dataflow: 'ESTAT:ROAD_EQS_CARPDA(1.0)',
          last_update: '16/01/24 23:00:00',
          freq: 'A',
          unit: 'NR',
          mot_nrg: 'ALT',
          geo: 'BG',
          time_period: 2020,
          obs_value: 352488,
          obs_flag: 's',
          millions_of_passenger_per_kilometres: 8952700,
          road_deaths_per_million_inhabitants: 463
        },
        {
          dataflow: 'ESTAT:ROAD_EQS_CARPDA(1.0)',
          last_update: '16/01/24 23:00:00',
          freq: 'A',
          unit: 'NR',
          mot_nrg: 'ALT',
          geo: 'BG',
          time_period: 2021,
          obs_value: 374094,
          obs_flag: 's',
          millions_of_passenger_per_kilometres: 4803,
          road_deaths_per_million_inhabitants: 561
        },
        {
          dataflow: 'ESTAT:ROAD_EQS_CARPDA(1.0)',
          last_update: '16/01/24 23:00:00',
          freq: 'A',
          unit: 'NR',
          mot_nrg: 'ALT',
          geo: 'CZ',
          time_period: 2016,
          obs_value: 15885,
          obs_flag: '',
          millions_of_passenger_per_kilometres: 87257,
          road_deaths_per_million_inhabitants: 611
        },
        {
          dataflow: 'ESTAT:ROAD_EQS_CARPDA(1.0)',
          last_update: '16/01/24 23:00:00',
          freq: 'A',
          unit: 'NR',
          mot_nrg: 'ALT',
          geo: 'CZ',
          time_period: 2017,
          obs_value: 18321,
          obs_flag: '',
          millions_of_passenger_per_kilometres: 90049,
          road_deaths_per_million_inhabitants: 577
        },
        {
          dataflow: 'ESTAT:ROAD_EQS_CARPDA(1.0)',
          last_update: '16/01/24 23:00:00',
          freq: 'A',
          unit: 'NR',
          mot_nrg: 'ALT',
          geo: 'CZ',
          time_period: 2018,
          obs_value: 128315,
          obs_flag: 'b',
          millions_of_passenger_per_kilometres: 94193,
          road_deaths_per_million_inhabitants: 656
        },
        {
          dataflow: 'ESTAT:ROAD_EQS_CARPDA(1.0)',
          last_update: '16/01/24 23:00:00',
          freq: 'A',
          unit: 'NR',
          mot_nrg: 'ALT',
          geo: 'DE',
          time_period: 2020,
          obs_value: 749305,
          obs_flag: '',
          millions_of_passenger_per_kilometres: 866646,
          road_deaths_per_million_inhabitants: 2719
        },
        {
          dataflow: 'ESTAT:ROAD_EQS_CARPDA(1.0)',
          last_update: '16/01/24 23:00:00',
          freq: 'A',
          unit: 'NR',
          mot_nrg: 'ALT',
          geo: 'DE',
          time_period: 2021,
          obs_value: 1042733,
          obs_flag: '',
          millions_of_passenger_per_kilometres: 881373,
          road_deaths_per_million_inhabitants: 2562
        },
        {
          dataflow: 'ESTAT:ROAD_EQS_CARPDA(1.0)',
          last_update: '16/01/24 23:00:00',
          freq: 'A',
          unit: 'NR',
          mot_nrg: 'ALT',
          geo: 'DE',
          time_period: 2022,
          obs_value: 1431375,
          obs_flag: '',
          millions_of_passenger_per_kilometres: 922440,
          road_deaths_per_million_inhabitants: 2788
        },
        {
          dataflow: 'ESTAT:ROAD_EQS_CARPDA(1.0)',
          last_update: '16/01/24 23:00:00',
          freq: 'A',
          unit: 'NR',
          mot_nrg: 'ALT',
          geo: 'DK',
          time_period: 2020,
          obs_value: 32140,
          obs_flag:    '',
          millions_of_passenger_per_kilometres: 69077,
          road_deaths_per_million_inhabitants: 163
        },
        {
          dataflow: 'ESTAT:ROAD_EQS_CARPDA(1.0)',
          last_update: '16/01/24 23:00:00',
          freq: 'A',
          unit: 'NR',
          mot_nrg: 'ALT',
          geo: 'DK',
          time_period: 2021,
          obs_value: 66926,
          obs_flag: '',
          millions_of_passenger_per_kilometres: 71852,
          road_deaths_per_million_inhabitants: 130
        },
        {
          dataflow: 'ESTAT:ROAD_EQS_CARPDA(1.0)',
          last_update: '16/01/24 23:00:00',
          freq: 'A',
          unit: 'NR',
          mot_nrg: 'ALT',
          geo: 'DK',
          time_period: 2022,
          obs_value: 112952,
          obs_flag: '',
          millions_of_passenger_per_kilometres: 76657,
          road_deaths_per_million_inhabitants: 154
        },
        {
          dataflow: 'ESTAT:ROAD_EQS_CARPDA(1.0)',
          last_update: '16/01/24 23:00:00',
          freq: 'A',
          unit: 'NR',
          mot_nrg: 'ALT',
          geo: 'ES',
          time_period: 2014,
          obs_value: 8059,
          obs_flag: '',
          millions_of_passenger_per_kilometres: 350393,
          road_deaths_per_million_inhabitants: 1680
        },
        {
          dataflow: 'ESTAT:ROAD_EQS_CARPDA(1.0)',
          last_update: '16/01/24 23:00:00',
          freq: 'A',
          unit: 'NR',
          mot_nrg: 'ALT',
          geo: 'ES',
          time_period: 2015,
          obs_value: 13290,
          obs_flag: '',
          millions_of_passenger_per_kilometres: 366092,
          road_deaths_per_million_inhabitants: 1689
        },
        {
          dataflow: 'ESTAT:ROAD_EQS_CARPDA(1.0)',
          last_update: '16/01/24 23:00:00',
          freq: 'A',
          unit: 'NR',
          mot_nrg: 'ALT',
          geo: 'FI',
          time_period: 2018,
          obs_value: 12688,
          obs_flag: '',
          millions_of_passenger_per_kilometres: 75961,
          road_deaths_per_million_inhabitants: 239
        },
        {
          dataflow: 'ESTAT:ROAD_EQS_CARPDA(1.0)',
          last_update: '16/01/24 23:00:00',
          freq: 'A',
          unit: 'NR',
          mot_nrg: 'ALT',
          geo: 'FI',
          time_period: 2019,
          obs_value: 19106,
          obs_flag: '',
          millions_of_passenger_per_kilometres: 75861,
          road_deaths_per_million_inhabitants: 211
        },
        {
          dataflow: 'ESTAT:ROAD_EQS_CARPDA(1.0)',
          last_update: '16/01/24 23:00:00',
          freq: 'A',
          unit: 'NR',
          mot_nrg: 'ALT',
          geo: 'FI',
          time_period: 2020,
          obs_value: 27694,
          obs_flag: '',
          millions_of_passenger_per_kilometres: 72061,
          road_deaths_per_million_inhabitants: 223
        }]
        const datosBU = backup_datos.map((entry, index) => {
            const { dataflow, last_update, ...rest } = entry;
            return { id: index + 1, ...rest };
      });
};  