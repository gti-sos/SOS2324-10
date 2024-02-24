


const datos_MRF = [
    {
        dataflow: 'estat:teco0115(1.0)',
        last_update: '02/02/24 23:00:00',
        frequency: 'a',
        unit: 'clv_pch_pre',
        na_item: 'b1gq',
        geo: 'austria',
        time_period: 2020,
        obs_value: -6.6,
        growth_rate_2030: 30357,
        growth_rate_2040: 34360
    },
    {
        dataflow: 'estat:teco0115(1.0)',
        last_update: '02/02/24 23:00:00',
        frequency: 'a',
        unit: 'clv_pch_pre',
        na_item: 'b1gq',
        geo: 'austria',
        time_period: 2021,
        obs_value: 4.2,
        growth_rate_2030: 34832,
        growth_rate_2040: 39426
    },
    {
        dataflow: 'estat:teco0115(1.0)',
        last_update: '02/02/24 23:00:00',
        frequency: 'a',
        unit: 'clv_pch_pre',
        na_item: 'b1gq',
        geo: 'austria',
        time_period: 2022,
        obs_value: 4.8,
        growth_rate_2030: 51398,
        growth_rate_2040: 58177
    },
    {
        dataflow: 'estat:teco0115(1.0)',
        last_update: '02/02/24 23:00:00',
        frequency: 'a',
        unit: 'clv_pch_pre',
        na_item: 'b1gq',
        geo: 'belgium',
        time_period: 2020,
        obs_value: -5.3,
        growth_rate_2030: 71573,
        growth_rate_2040: 81533
    },
    {
        dataflow: 'estat:teco0115(1.0)',
        last_update: '02/02/24 23:00:00',
        frequency: 'a',
        unit: 'clv_pch_pre',
        na_item: 'b1gq',
        geo: 'belgium',
        time_period: 2021,
        obs_value: 6.9,
        growth_rate_2030: 44930,
        growth_rate_2040: 51183
    },
    {
        dataflow: 'estat:teco0115(1.0)',
        last_update: '02/02/24 23:00:00',
        frequency: 'a',
        unit: 'clv_pch_pre',
        na_item: 'b1gq',
        geo: 'belgium',
        time_period: 2022,
        obs_value: 3.0,
        growth_rate_2030: 32478,
        growth_rate_2040: 36998
    },
    {
        dataflow: 'estat:teco0115(1.0)',
        last_update: '02/02/24 23:00:00',
        frequency: 'a',
        unit: 'clv_pch_pre',
        na_item: 'b1gq',
        geo: 'czech_republic',
        time_period: 2020,
        obs_value: -5.5,
        growth_rate_2030: 42058,
        growth_rate_2040: 49646
    },
    {
        dataflow: 'estat:teco0115(1.0)',
        last_update: '02/02/24 23:00:00',
        frequency: 'a',
        unit: 'clv_pch_pre',
        na_item: 'b1gq',
        geo: 'czech_republic',
        time_period: 2021,
        obs_value: 3.6,
        growth_rate_2030: 15609,
        growth_rate_2040: 18424
    },
    {
        dataflow: 'estat:teco0115(1.0)',
        last_update: '02/02/24 23:00:00',
        frequency: 'a',
        unit: 'clv_pch_pre',
        na_item: 'b1gq',
        geo: 'czech_republic',
        time_period: 2022,
        obs_value: 2.4,
        growth_rate_2030: 17403,
        growth_rate_2040: 20542
    },
    {
        dataflow: 'estat:teco0115(1.0)',
        last_update: '02/02/24 23:00:00',
        frequency: 'a',
        unit: 'clv_pch_pre',
        na_item: 'b1gq',
        geo: 'denmark',
        time_period: 2020,
        obs_value: -2.4,
        growth_rate_2030: 66538,
        growth_rate_2040: 75680
    },
    {
        dataflow: 'estat:teco0115(1.0)',
        last_update: '02/02/24 23:00:00',
        frequency: 'a',
        unit: 'clv_pch_pre',
        na_item: 'b1gq',
        geo: 'denmark',
        time_period: 2021,
        obs_value: 6.8,
        growth_rate_2030: 38794,
        growth_rate_2040: 44123
    },
    {
        dataflow: 'estat:teco0115(1.0)',
        last_update: '02/02/24 23:00:00',
        frequency: 'a',
        unit: 'clv_pch_pre',
        na_item: 'b1gq',
        geo: 'denmark',
        time_period: 2022,
        obs_value: 2.7,
        growth_rate_2030: 49658,
        growth_rate_2040: 56480
    },
    {
        dataflow: 'estat:teco0115(1.0)',
        last_update: '02/02/24 23:00:00',
        frequency: 'a',
        unit: 'clv_pch_pre',
        na_item: 'b1gq',
        geo: 'spain',
        time_period: 2021,
        obs_value: 6.4,
        growth_rate_2030: 33894,
        growth_rate_2040: 37961
    },
    {
        dataflow: 'estat:teco0115(1.0)',
        last_update: '02/02/24 23:00:00',
        frequency: 'a',
        unit: 'clv_pch_pre',
        na_item: 'b1gq',
        geo: 'spain',
        time_period: 2022,
        obs_value: 5.8,
        growth_rate_2030: 36109,
        growth_rate_2040: 40443
    },
    {
        dataflow: 'estat:teco0115(1.0)',
        last_update: '02/02/24 23:00:00',
        frequency: 'a',
        unit: 'clv_pch_pre',
        na_item: 'b1gq',
        geo: 'spain',
        time_period: 2023,
        obs_value: 2.5,
        growth_rate_2030: 32608,
        growth_rate_2040: 36522
    }
]

module.exports = datos_MRF;


function previsionPIBporGeo(datos_MRF) {
    let mediasPorPais = {};
    datos_MRF.forEach(function(mapa) {
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

const mediaPIB = previsionPIBporGeo(datos_MRF)