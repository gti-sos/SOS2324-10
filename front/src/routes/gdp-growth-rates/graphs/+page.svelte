<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>

</svelte:head>


<script>

    import { onMount } from "svelte";
    let dataAvailable = false;

    let API_DATA = "https://sos2324-10.appspot.com/api/v2/gdp-growth-rates";

    async function getGDP() {
        try {
            const res = await fetch(API_DATA);
            const data = await res.json();
            console.log(`Data received: ${JSON.stringify(data, null, 2)}`);
            console.log(data.length);

            if (data.length > 0) {
                dataAvailable = true; 
                createBubbleChart(data);
            }

        } catch (error) {
            console.log(`Error fetching data: ${error}`);
        }
    }


    // Función asíncrona para cargar datos desde el servidor
    async function loadInitialGDP() {

        try {
            let response = await fetch(API_DATA + "/loadInitialData", {
                method: "GET",
            });

            let status = await response.status;
            console.log(`Status code: ${status}`);
            dataAvailable = true;
            if (status === 200) {
                await getGDP();
            } 

        } catch (error) {
            console.log(`Error loading initail GDP data: ${error}`)
        }
    }   
    
    /**
     * 
    function meanGrowthRate(data) {
        // Objeto para almacenar la suma de crecimiento y la cantidad de veces que aparece cada país
        const sumas = {};
        const conteo = {};

        // Iterar sobre los datos para calcular la suma de crecimiento y el conteo de cada país
        data.forEach(entry => {
            const pais = entry.geo;
            const crecimiento = (entry.growth_rate_2030 + entry.growth_rate_2040) / 2;

            if (sumas[pais]) {
                sumas[pais] += crecimiento;
                conteo[pais]++;
            } else {
                sumas[pais] = crecimiento;
                conteo[pais] = 1;
            }
        });

        // Objeto para almacenar la media de crecimiento de cada país
        const medias = {};

        // Calcular la media de crecimiento para cada país
        for (const pais in sumas) {
            medias[pais] = sumas[pais] / conteo[pais];
        }

        // Ordenar los países por su media de crecimiento de mayor a menor
        const paisesOrdenados = Object.keys(medias).sort((a, b) => medias[b] - medias[a]);

        // Preparar los datos en un formato adecuado para Highcharts
        const dataHighcharts = paisesOrdenados.map(pais => ({
            name: pais,
            y: medias[pais]
        }));

        // Devolver los datos en un formato adecuado para Highcharts
        return dataHighcharts;
    }
    */
    // Crear un gráfico de pastel utilizando Highcharts
    

   
    // Crear un gráfico de dispersión utilizando Highcharts
    function createBubbleChart(data) {

        const scatterChart = Highcharts.chart('container', {

            chart: {
                type: 'bubble',
                plotBorderWidth: 1,
                zoomType: 'xy'
            },

            legend: {
                enabled: false
            },

            title: {
                text: 'Sugar and fat intake per country'
            },

            subtitle: {
                text: 'Source: <a href="http://www.euromonitor.com/">Euromonitor</a> and <a href="https://data.oecd.org/">OECD</a>'
            },

            accessibility: {
                point: {
                    valueDescriptionFormat: '{index}. {point.name}, fat: {point.x}g, sugar: {point.y}g, obesity: {point.z}%.'
                }
            },

            xAxis: {
                gridLineWidth: 1,
                title: {
                    text: 'Daily fat intake'
                },
                labels: {
                    format: '{value} gr'
                },
                plotLines: [{
                    color: 'black',
                    dashStyle: 'dot',
                    width: 2,
                    value: 65,
                    label: {
                        rotation: 0,
                        y: 15,
                        style: {
                            fontStyle: 'italic'
                        },
                        text: 'Safe fat intake 65g/day'
                    },
                    zIndex: 3
                }],
                accessibility: {
                    rangeDescription: 'Range: 60 to 100 grams.'
                }
            },

            yAxis: {
                startOnTick: false,
                endOnTick: false,
                title: {
                    text: 'Daily sugar intake'
                },
                labels: {
                    format: '{value} gr'
                },
                maxPadding: 0.2,
                plotLines: [{
                    color: 'black',
                    dashStyle: 'dot',
                    width: 2,
                    value: 50,
                    label: {
                        align: 'right',
                        style: {
                            fontStyle: 'italic'
                        },
                        text: 'Safe sugar intake 50g/day',
                        x: -10
                    },
                    zIndex: 3
                }],
                accessibility: {
                    rangeDescription: 'Range: 0 to 160 grams.'
                }
            },

            tooltip: {
                useHTML: true,
                headerFormat: '<table>',
                pointFormat: '<tr><th colspan="2"><h3>{point.country}</h3></th></tr>' +
                    '<tr><th>Fat intake:</th><td>{point.x}g</td></tr>' +
                    '<tr><th>Sugar intake:</th><td>{point.y}g</td></tr>' +
                    '<tr><th>Obesity (adults):</th><td>{point.z}%</td></tr>',
                footerFormat: '</table>',
                followPointer: true
            },

            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}'
                    }
                }
            },

            series: [{
                data: [
                    { x: 95, y: 95, z: 13.8, name: 'BE', country: 'Belgium' },
                    { x: 86.5, y: 102.9, z: 14.7, name: 'DE', country: 'Germany' },
                    { x: 80.8, y: 91.5, z: 15.8, name: 'FI', country: 'Finland' },
                    { x: 80.4, y: 102.5, z: 12, name: 'NL', country: 'Netherlands' },
                    { x: 80.3, y: 86.1, z: 11.8, name: 'SE', country: 'Sweden' },
                    { x: 78.4, y: 70.1, z: 16.6, name: 'ES', country: 'Spain' },
                    { x: 74.2, y: 68.5, z: 14.5, name: 'FR', country: 'France' },
                    { x: 73.5, y: 83.1, z: 10, name: 'NO', country: 'Norway' },
                    { x: 71, y: 93.2, z: 24.7, name: 'UK', country: 'United Kingdom' },
                    { x: 69.2, y: 57.6, z: 10.4, name: 'IT', country: 'Italy' },
                    { x: 68.6, y: 20, z: 16, name: 'RU', country: 'Russia' },
                    { x: 65.5, y: 126.4, z: 35.3, name: 'US', country: 'United States' },
                    { x: 65.4, y: 50.8, z: 28.5, name: 'HU', country: 'Hungary' },
                    { x: 63.4, y: 51.8, z: 15.4, name: 'PT', country: 'Portugal' },
                    { x: 64, y: 82.9, z: 31.3, name: 'NZ', country: 'New Zealand' }
                ],
                colorByPoint: true
            }]

        });
    }
            


    onMount(() => {
        getGDP();
    });

</script>


<div id="container"></div>
