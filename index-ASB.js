let data = `dataflow,last update,freq,unit,mot_nrg,geo,time_period,obs_value,obs_flag,millions_of_passenger_per_kilometres,road_deaths_per_million_inhabitants
ESTAT:ROAD_EQS_CARPDA(1.0),16/01/24 23:00:00,A,NR,ALT,AT,2015,10125,,90630,479
ESTAT:ROAD_EQS_CARPDA(1.0),16/01/24 23:00:00,A,NR,ALT,AT,2016,14459,,93090,432
ESTAT:ROAD_EQS_CARPDA(1.0),16/01/24 23:00:00,A,NR,ALT,AT,2017,20180,,94757,414
ESTAT:ROAD_EQS_CARPDA(1.0),16/01/24 23:00:00,A,NR,ALT,BE,2013,18859,,132615,764
ESTAT:ROAD_EQS_CARPDA(1.0),16/01/24 23:00:00,A,NR,ALT,BG,2020,352488,s,8952700,463
ESTAT:ROAD_EQS_CARPDA(1.0),16/01/24 23:00:00,A,NR,ALT,BG,2021,374094,s,4803,561
ESTAT:ROAD_EQS_CARPDA(1.0),16/01/24 23:00:00,A,NR,ALT,CZ,2016,15885,,87257,611
ESTAT:ROAD_EQS_CARPDA(1.0),16/01/24 23:00:00,A,NR,ALT,CZ,2017,18321,,90049,577
ESTAT:ROAD_EQS_CARPDA(1.0),16/01/24 23:00:00,A,NR,ALT,CZ,2018,128315,b,94193,656
ESTAT:ROAD_EQS_CARPDA(1.0),16/01/24 23:00:00,A,NR,ALT,DE,2020,749305,,866646,2719
ESTAT:ROAD_EQS_CARPDA(1.0),16/01/24 23:00:00,A,NR,ALT,DE,2021,1042733,,881373,2562
ESTAT:ROAD_EQS_CARPDA(1.0),16/01/24 23:00:00,A,NR,ALT,DE,2022,1431375,,922440,2788
ESTAT:ROAD_EQS_CARPDA(1.0),16/01/24 23:00:00,A,NR,ALT,DK,2020,32140,,69077,163
ESTAT:ROAD_EQS_CARPDA(1.0),16/01/24 23:00:00,A,NR,ALT,DK,2021,66926,,71852,130
ESTAT:ROAD_EQS_CARPDA(1.0),16/01/24 23:00:00,A,NR,ALT,DK,2022,112952,,76657,154
ESTAT:ROAD_EQS_CARPDA(1.0),16/01/24 23:00:00,A,NR,ALT,ES,2014,8059,,350393,1680
ESTAT:ROAD_EQS_CARPDA(1.0),16/01/24 23:00:00,A,NR,ALT,ES,2015,13290,,366092,1689
ESTAT:ROAD_EQS_CARPDA(1.0),16/01/24 23:00:00,A,NR,ALT,FI,2018,12688,,75961,239
ESTAT:ROAD_EQS_CARPDA(1.0),16/01/24 23:00:00,A,NR,ALT,FI,2019,19106,,75861,211
ESTAT:ROAD_EQS_CARPDA(1.0),16/01/24 23:00:00,A,NR,ALT,FI,2020,27694,,72061,223`;

let lines = data.split('\n');
let columnas = lines[0].split(',');
let datos = [];

for (let i = 1; i < lines.length; i++) {
    let elem = lines[i].split(',');
    let map = new Map();
    for (let j = 0; j < columnas.length; j++) {
        map.set(columnas[j], elem[j]);
    }
    datos.push(map);
}
module.exports = datos;

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

let res = calcularPorcentajeMuertosPorKilometro(datos);
console.log('Porcentaje de muertos en carretera por kilómetro de carretera por país:');
console.log(res);
