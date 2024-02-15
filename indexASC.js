

let csvData = `dataflow,last_update,freq,vehicle,unit,geo,time_period,obs_value,flights_passangers,cars_deaths
ESTAT:ROAD_EQS_CARAGE(1.0),19/12/23 23:00:00,A,NR,TOTAL,BG,2020,2866763,null,75.4
ESTAT:ROAD_EQS_CARAGE(1.0),19/12/23 23:00:00,A,NR,TOTAL,BG,2021,2830464,7.7,72.3
ESTAT:ROAD_EQS_CARAGE(1.0),19/12/23 23:00:00,A,NR,TOTAL,CZ,2013,4729185,null,0.0
ESTAT:ROAD_EQS_CARAGE(1.0),19/12/23 23:00:00,A,NR,TOTAL,CZ,2014,4833386,2.3,100.7
ESTAT:ROAD_EQS_CARAGE(1.0),19/12/23 23:00:00,A,NR,TOTAL,LT,2014,1205668,null,3.5
ESTAT:ROAD_EQS_CARAGE(1.0),19/12/23 23:00:00,A,NR,TOTAL,LT,2015,1244063,2.0,100.0
ESTAT:ROAD_EQS_CARAGE(1.0),19/12/23 23:00:00,A,NR,TOTAL,ES,2016,22876830,3.0,100.6
ESTAT:ROAD_EQS_CARAGE(1.0),19/12/23 23:00:00,A,NR,TOTAL,ES,2017,23500401,3.0,94.4
ESTAT:ROAD_EQS_CARAGE(1.0),19/12/23 23:00:00,A,NR,TOTAL,PL,2015,18011775,null,4.4
ESTAT:ROAD_EQS_CARAGE(1.0),19/12/23 23:00:00,A,NR,TOTAL,PL,2016,18718408,null,3.0
ESTAT:ROAD_EQS_CARAGE(1.0),19/12/23 23:00:00,A,NR,Y10-20,IT,2017,21318885,1.9,105.3
ESTAT:ROAD_EQS_CARAGE(1.0),19/12/23 23:00:00,A,NR,Y10-20,IT,2018,21965599,1.1,102.0
ESTAT:ROAD_EQS_CARAGE(1.0),19/12/23 23:00:00,A,NR,Y_LT2,SE,2018,936840,0.8,83.5
ESTAT:ROAD_EQS_CARAGE(1.0),19/12/23 23:00:00,A,NR,Y_LT2,SE,2019,882084,1.0,82.2
ESTAT:ROAD_EQS_CARAGE(1.0),19/12/23 23:00:00,A,NR,Y_LT2,HU,2016,204007,2.2,103.1
ESTAT:ROAD_EQS_CARAGE(1.0),19/12/23 23:00:00,A,NR,Y_LT2,HU,2017,244719,4.3,103.5
ESTAT:ROAD_EQS_CARAGE(1.0),19/12/23 23:00:00,A,NR,TOTAL,EU27_2020,2018,240415203,1.9,96.6
ESTAT:ROAD_EQS_CARAGE(1.0),19/12/23 23:00:00,A,NR,TOTAL,EU27_2020,2019,244951204,1.6,95.4
ESTAT:ROAD_EQS_CARAGE(1.0),19/12/23 23:00:00,A,NR,TOTAL,EU27_2020,2020,247754214,-5.7,79.2
ESTAT:ROAD_EQS_CARAGE(1.0),19/12/23 23:00:00,A,NR,Y2-5,AT,2018,874539,2.4,90.7
ESTAT:ROAD_EQS_CARAGE(1.0),19/12/23 23:00:00,A,NR,Y2-5,AT,2019,900900,1.5,87.5
ESTAT:ROAD_EQS_CARAGE(1.0),19/12/23 23:00:00,A,NR,TOTAL,BG,2013,2910235,-0.5,94.4
ESTAT:ROAD_EQS_CARAGE(1.0),19/12/23 23:00:00,A,NR,TOTAL,BG,2014,3013863,0.9,99.1
ESTAT:ROAD_EQS_CARAGE(1.0),19/12/23 23:00:00,A,NR,Y5-10,CH,2015,1315144,1.6,100.0
ESTAT:ROAD_EQS_CARAGE(1.0),19/12/23 23:00:00,A,NR,Y5-10,CH,2016,1372084,2.1,99.8
ESTAT:ROAD_EQS_CARAGE(1.0),19/12/23 23:00:00,A,NR,Y5-10,CH,2017,1428311,1.4,99.6
ESTAT:ROAD_EQS_CARAGE(1.0),19/12/23 23:00:00,A,NR,TOTAL,DE,2019,47715977,1.1,91.1
ESTAT:ROAD_EQS_CARAGE(1.0),19/12/23 23:00:00,A,NR,TOTAL,DE,2020,48248584,-3.8,79.9
ESTAT:ROAD_EQS_CARAGE(1.0),19/12/23 23:00:00,A,NR,Y_GT20,UK,2016,572233,1.7,99.4
ESTAT:ROAD_EQS_CARAGE(1.0),19/12/23 23:00:00,A,NR,Y_GT20,UK,2017,617953,1.7,103.6
ESTAT:ROAD_EQS_CARAGE(1.0),19/12/23 23:00:00,A,NR,Y_GT20,UK,2018,692318,1.3,103.8
`;



let lines = csvData
.split('\n');
let columnas = lines[0].split(',');
let csv = [];


for (let i = 1; i < lines.length; i++) {
    let elementos = lines[i].split(',');
    let mapa = new Map();
    for (let j = 0; j < columnas.length; j++) {
        mapa.set(columnas[j], elementos[j]);
    }
    csv.push(mapa);
}

function calcularMediaObsValuePorPais(csv) {
    let mediasPais = {};
    csv.forEach(function(n) {
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

let mediasObsValuePorPais = calcularMediaObsValuePorPais(csv);
for (let pais in mediasObsValuePorPais) {
    console.log(mediasObsValuePorPais[pais].mensaje);
}

