<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/highcharts-more.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
    <script src="https://code.highcharts.com/modules/treemap.js"></script>
    <script src="https://code.highcharts.com/modules/heatmap.js"></script>

</svelte:head>


<script>

    import { onMount } from "svelte";

    let API_DATA = "https://sos2324-10.appspot.com/api/v2/gdp-growth-rates";

    async function getGDP() {
        try {
            const res = await fetch(API_DATA);
            const data = await res.json();
            console.log(data);
            if (data.length > 0) {
                createBubbleChart(meanGrowthRate(data));
                createTreemapChart(meanGrowthRate(data));
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
            if (status === 200) {
                await getGDP();
            } 

        } catch (error) {
            console.log(`Error loading initail GDP data: ${error}`)
        }
    }   
    
    function meanGrowthRate(data) {
        const groupedData = data.reduce((acc, curr) => {
            if (!acc[curr.geo]) {
                acc[curr.geo] = { total2030: 0, total2040: 0, count: 0 };
            }
            acc[curr.geo].total2030 += curr.growth_rate_2030;
            acc[curr.geo].total2040 += curr.growth_rate_2040;
            acc[curr.geo].count++;
            return acc;
        }, {});

        const averagedData = Object.keys(groupedData).map(country => {
            const { total2030, total2040, count } = groupedData[country];
            return {
                geo: country,
                growth_rate_2030: total2030 / count,
                growth_rate_2040: total2040 / count
            };
        });

        return averagedData;
    }
    

   
    // Crear un gráfico de dispersión utilizando Highcharts
    function createBubbleChart(data) {

        const seriesData = data.map(entry => ({
                x: entry.growth_rate_2030,
                y: entry.growth_rate_2040,
                name: entry.geo,
                country: entry.geo // Si deseas mantener la propiedad 'country' como en tu ejemplo original
        }));

        const scatterChart = Highcharts.chart('bubble-container', {

            chart: {
                type: 'bubble',
                plotBorderWidth: 1,
                zoomType: 'xy'
            },

            legend: {
                enabled: false
            },

            title: {
                text: 'Estimación de crecimiento en las próximas decadas'
            },

            subtitle: {
                text: 'Source: <a href="https://sos2324-10.appspot.com/api/v2/gdp-growth-rates">Gdp-growth-rates</a>'
            },

            accessibility: {
                point: {
                    valueDescriptionFormat: '{index}. {point.name}, 2030: {point.x}$, 2040: {point.y}$'
                }
            },

            xAxis: {
                gridLineWidth: 1,
                title: {
                    text: 'Crecimiento 2030'
                },
                labels: {
                    format: '{value} $'
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
                    },
                    zIndex: 3
                }],
                accessibility: {
                    rangeDescription: 'Range: 10000 to 100000 millions.'
                }
            },

            yAxis: {
                startOnTick: false,
                endOnTick: false,
                title: {
                    text: 'Crecimiento 2040'
                },
                labels: {
                    format: '{value} $'
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
                    },
                    zIndex: 3
                }],
                accessibility: {
                    rangeDescription: 'Range: 10000 to 100000 millions.'
                }
            },

            tooltip: {
                useHTML: true,
                headerFormat: '<table>',
                pointFormat: '<tr><th colspan="2"><h3>{point.country}</h3></th></tr>' +
                    '<tr><th>Crecimiento 2030:</th><td>{point.x} millions</td></tr>' +
                    '<tr><th>Crecimiento 2040:</th><td>{point.y} millions</td></tr>',
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
                data: seriesData,
                colorByPoint: true
            }]

        });
    }


    async function createTreemapChart(data) {
        let points = [];
        let regionI = 0;

        data.forEach(entry => {
            points.push({
                id: `id_${regionI}`,
                name: entry.geo,
                value: entry.growth_rate_2030
            });
            regionI++;
        });

        Highcharts.chart('treemap-container', {
            series: [{
                name: 'Regions',
                type: 'treemap',
                layoutAlgorithm: 'squarified',
                allowDrillToNode: true,
                animationLimit: 1000,
                dataLabels: {
                    enabled: false
                },
                levels: [{
                    level: 1,
                    dataLabels: {
                        enabled: true
                    },
                    borderWidth: 3,
                    levelIsConstant: false
                }, {
                    level: 1,
                    dataLabels: {
                        style: {
                            fontSize: '14px'
                        }
                    }
                }],
                accessibility: {
                    exposeAsGroupOnly: true
                },
                data: points,
                colorByPoint: true
            }],
            subtitle: {
                text: 'Source: <a href="https://sos2324-10.appspot.com/api/v2/gdp-growth-rates">Gdp-growth-rates</a>',
                align: 'left'
            },
            title: {
                text: 'Growth Rate 2030 by Region',
                align: 'left'
            }
        });
    }

    
            


    onMount(async () => {
        await loadInitialGDP();
        await getGDP();
    });

</script>

<div id="bubble-container"></div>
<br>
<div id="treemap-container"></div>
