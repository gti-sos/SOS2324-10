//


let csvData = `DATAFLOW,last_update,freq,vehicle,unit,geo,time_period,obs_value,flights_passangers,cars_deaths
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,BUS_TOT,NR,AL,2017,6583,18336,1079
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,BUS_TOT,NR,AL,2021,7867,26258,976
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,BUS_TOT,NR,AT,1990,9400,25762,958
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,BUS_TOT,NR,AT,1991,9400,23582,956
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,BUS_TOT,NR,AT,1992,9900,24887,931
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,BUS_TOT,NR,ES,2003,56000,24580,878
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,BUS_TOT,NR,ES,2004,57000,23372,768
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,BUS_TOT,NR,ES,2005,58200,24235,730
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,BUS_TOT,NR,ES,2006,60400,26353,691
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,BUS_TOT,NR,ES,2007,61000,22210,679
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,BUS_TOT,NR,BE,2008,16000,19744,633
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,BUS_TOT,NR,BE,2009,16100,17677,552
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,BUS_TOT,NR,BE,2010,16200,17055,523
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,BUS_TOT,NR,BE,2011,16100,14031,531
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,BUS_TOT,NR,BE,2012,16000,13733,455
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,BUS_TOT,NR,BE,2013,15800,13115,430
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,BUS_TOT,NR,BG,2012,23000,12675,479
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,BUS_TOT,NR,BG,2013,23300,11562,432
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,BUS_TOT,NR,BG,2014,23603,10777,414
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,BUS_TOT,NR,BG,2015,24010,10119,409
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,BUS_TOT,NR,BG,2016,23359,8537,416
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,BUS_TOT,NR,BG,2017,21020,7837,344
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,BUS_TOT,NR,BG,2018,20818,9246,362
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,BUS_TOT,NR,BG,2019,20687,9026,370
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,TRC,NR,BE,2014,44693,2532,1397
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,TRC,NR,BE,2015,44851,2637,1470
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,TRC,NR,BE,2016,45749,6320,1486
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,TRC,NR,BE,2017,47339,137,1306
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,TRC,NR,BE,2018,47626,20826,1213
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,TRC,NR,BE,2019,52209,22086,1162
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,TRC,NR,BE,2020,52690,20880,1089
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,TRC,NR,BE,2021,53814,19433,1069
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,TRC,NR,PT,2011,41900,20677,1071
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,TRC,NR,PT,2012,36654,20749,944
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,TRC,NR,PT,2013,34054,22855,944
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,TRC,NR,PT,2014,37312,32397,850
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,TRC,NR,PT,2015,39286,35515,884
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,TRC,NR,PT,2016,41175,30181,827
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,TRC,NR,PT,2017,45144,27064,764
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,TRC,NR,PT,2018,50125,25728,745
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,TRC,NR,PT,2019,55587,26591,762
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,TRC,NR,PT,2020,49916,22386,670
ESTAT:TRAN_R_VEHST(1.0),13/10/23 23:00:00,A,TRC,NR,PT,2021,50602,19662,609`;


let lineas = csvData.split('\n');
let csv = [];

//Añadir csv a Array
for (let linea = 0; linea < lineas.length; linea++) {
    let parseo = lineas[linea].split(',');
    csv.push(parseo);
}

//función que calcula la media de muertes por país como parámetro
function calcularMediaMuertesPorPais(datos, pais) {
    let muertes = 0;
    let contador = 0;

    datos.forEach(function(linea) {
        if (linea[5] === pais) {
            muertes += parseInt(linea[9]); 
            contador++;
        }
    });
    let media = muertes / contador;
    return media;
}

let mediaMuertesEspaña = calcularMediaMuertesPorPais(csv, "ES");
console.log("La media de muertes en España por accidentes: " + mediaMuertesEspaña);