<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
</svelte:head>

<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    let API_MRF = "/api/v2/gdp-growth-rates";
    if(dev)
        API_MRF = "http://localhost:8080" + API_MRF;


    onMount(async () => {
        const gdpData = await getGDP();
        if (gdpData.length === 0) {
            errorMsg = "La base de datos está vacía, no es posible hacer las gráficas";
        } else {
            createChart(gdpData);
        }
    });

    async function getGDP() {
        try {
            const res = await fetch(API_MRF);
            const datos_MRF = await res.json();
            console.log(`Data received: ${JSON.stringify(datos_MRF, null, 2)}`);
            return datos_MRF;
           // createSecondGraph(datos_MRF);
        } catch (error) {
            console.error("Error en la solicitud de datos:", error);
        }
    }


    function calcularDiferencia(datos_MRF) {
    // Verifica que los datos sean un array
    if (!Array.isArray(data)) {
        console.error("Los datos no son un array:", data);
        return [];
    }

    // Itera sobre cada elemento de los datos y calcula la diferencia
    const diferencias = data.map(entry => {
        // Extrae los valores de growth_rate_2040 y growth_rate_2030
        const { growth_rate_2040, growth_rate_2030 } = entry;
        
        // Calcula la diferencia entre growth_rate_2040 y growth_rate_2030
        const diferencia = growth_rate_2040 - growth_rate_2030;

        // Retorna un nuevo objeto con la diferencia calculada
        return {
            geo: entry.geo,
            diferencia: diferencia
        };
    });

    return diferencias;
}

    

    function createChart(diferencias) {
        Highcharts.chart('container', {
            chart: {
                type: 'area'
            },
            title: {
                text: 'Diferencias entre Growth Rate 2040 y Growth Rate 2030 por País'
            },
            subtitle: {
                text: 'Source: Tu API'
            },
            xAxis: {
                categories: diferencias.map(entry => entry.geo),
                title: {
                    text: 'País'
                }
            },
            yAxis: {
                title: {
                    text: 'Diferencia'
                }
            },
            tooltip: {
                shared: true,
                valueSuffix: ' unidades'
            },
            plotOptions: {
                area: {
                    stacking: 'normal',
                    lineColor: '#666666',
                    lineWidth: 1,
                    marker: {
                        lineWidth: 1,
                        lineColor: '#666666'
                    }
                }
            },
            series: [{
                name: 'Diferencia',
                data: diferencias.map(entry => entry.diferencia)
            }]
        });
    }

    let errorMsg = '';
</script>

<div id="container" style="width:100%; height:400px;"></div>

<div class="salida">
    <!-- Exito o error -->
    {#if errorMsg != ""}
        <hr>ERROR: {errorMsg}
    {/if}
</div>
