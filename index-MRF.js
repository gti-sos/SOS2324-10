// CSV inicial

let datosEntrada = `dataflow,last_update,frequency,unit,na_item,geo,time_period,obs_value,growth_rate_2030,growth_rate_2040
estat:teco0115(1.0),02/02/24 23:00:00,a,clv_pch_pre,b1gq,austria,2020,-6.6,30357,34360,
estat:teco0115(1.0),02/02/24 23:00:00,a,clv_pch_pre,b1gq,austria,2021,4.2,34832,39426,
estat:teco0115(1.0),02/02/24 23:00:00,a,clv_pch_pre,b1gq,austria,2022,4.8,51398,58177,
estat:teco0115(1.0),02/02/24 23:00:00,a,clv_pch_pre,b1gq,belgium,2020,-5.3,71573,81533,
estat:teco0115(1.0),02/02/24 23:00:00,a,clv_pch_pre,b1gq,belgium,2021,6.9,44930,51183,
estat:teco0115(1.0),02/02/24 23:00:00,a,clv_pch_pre,b1gq,belgium,2022,3.0,32478,36998,
estat:teco0115(1.0),02/02/24 23:00:00,a,clv_pch_pre,b1gq,czech_republic,2020,-5.5,42058,49646,
estat:teco0115(1.0),02/02/24 23:00:00,a,clv_pch_pre,b1gq,czech_republic,2021,3.6,15609,18424,
estat:teco0115(1.0),02/02/24 23:00:00,a,clv_pch_pre,b1gq,czech_republic,2022,2.4,17403,20542,
estat:teco0115(1.0),02/02/24 23:00:00,a,clv_pch_pre,b1gq,denmark,2020,-2.4,66538,75680,
estat:teco0115(1.0),02/02/24 23:00:00,a,clv_pch_pre,b1gq,denmark,2021,6.8,38794,44123,
estat:teco0115(1.0),02/02/24 23:00:00,a,clv_pch_pre,b1gq,denmark,2022,2.7,49658,56480,
estat:teco0115(1.0),02/02/24 23:00:00,a,clv_pch_pre,b1gq,spain,2021,6.4,33894,37961,
estat:teco0115(1.0),02/02/24 23:00:00,a,clv_pch_pre,b1gq,spain,2022,5.8,36109,40443,
estat:teco0115(1.0),02/02/24 23:00:00,a,clv_pch_pre,b1gq,spain,2023,2.5,32608,36522`;


let lines = datosEntrada.split('\n');
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


function previsionPIBporGeo(csv) {
    let mediasPorPais = {};
    csv.forEach(function(mapa) {
        let geo = mapa.get('geo');
        let crecimiento = parseInt(mapa.get('growth_rate_2030'));
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

let mediasCrecimientoPorPais = previsionPIBporGeo(csv);
for (let pais in mediasCrecimientoPorPais) {
    console.log(mediasCrecimientoPorPais[pais].mensaje);
}
