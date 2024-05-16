<script>
	import { onMount } from 'svelte';

	let API_DATA = 'https://sos2324-10.appspot.com/api/v2/gdp-growth-rates';
    let ALL_DATA_API = 'https://sos2324-10.appspot.com/api/v2/gdp-growth-rates/all';


	
	async function getGDP() {
		try {
			const res = await fetch(ALL_DATA_API);
			const data = await res.json();
			console.log(data);
			// Si hay datos se crean las graficas
			if (data.length > 0) {
				createBubbleChart(meanGrowthRate(data));
				createTreemapChart(meanGrowthRate(data));
				createRadarChart(meanGrowthRate(data));
			}
		} catch (error) {
			console.log(`Error fetching data: ${error}`);
		}
	}

	// Función asíncrona para cargar datos desde el servidor
	async function loadInitialGDP() {
		try {
			let response = await fetch(API_DATA + '/loadInitialData', {
				method: 'GET'
			});

			let status = await response.status;
			console.log(`Status code: ${status}`);
			if (status === 200) {
				await getGDP();
			}
		} catch (error) {
			console.log(`Error loading initail GDP data: ${error}`);
		}
	}


	// Calculamos las medias para cada dato por pais
	function meanGrowthRate(data) {
        const groupedData = data.reduce((acc, curr) => {
            if (!acc[curr.geo]) {
                acc[curr.geo] = { total2030: 0, total2040: 0, totalObs: 0, count: 0 };
            }
            acc[curr.geo].total2030 += curr.growth_rate_2030;
            acc[curr.geo].total2040 += curr.growth_rate_2040;
            acc[curr.geo].totalObs += curr.obs_value;
            acc[curr.geo].count++;
            return acc;
        }, {});

        const averagedData = Object.keys(groupedData).map((country) => {
            const { total2030, total2040, totalObs, count } = groupedData[country];
            return {
                geo: country,
                growth_rate_2030: total2030 / count,
                growth_rate_2040: total2040 / count,
                obs_value: totalObs / count
            };
        });

        return averagedData;
    }


	// Creacion de un gráfico de dispersión utilizando Highcharts
	function createBubbleChart(data) {
		const seriesData = data.map((entry) => ({
			x: entry.growth_rate_2030,
			y: entry.growth_rate_2040,
			name: entry.geo,
			country: entry.geo 
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
				plotLines: [
					{
						color: 'black',
						dashStyle: 'dot',
						width: 2,
						value: 65,
						label: {
							rotation: 0,
							y: 15,
							style: {
								fontStyle: 'italic'
							}
						},
						zIndex: 3
					}
				],
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
				plotLines: [
					{
						color: 'black',
						dashStyle: 'dot',
						width: 2,
						value: 50,
						label: {
							align: 'right',
							style: {
								fontStyle: 'italic'
							}
						},
						zIndex: 3
					}
				],
				accessibility: {
					rangeDescription: 'Range: 10000 to 100000 millions.'
				}
			},

			tooltip: {
				useHTML: true,
				headerFormat: '<table>',
				pointFormat:
					'<tr><th colspan="2"><h3>{point.country}</h3></th></tr>' +
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

			series: [
				{
					data: seriesData,
					colorByPoint: true
				}
			]
		});
	}

	// Creación de un mapa Tree que representa el PIB de los paises para 2030
	async function createTreemapChart(data) {
		let points = [];
		let regionI = 0;

		data.forEach((entry) => {
			points.push({
				id: `id_${regionI}`,
				name: entry.geo,
				value: entry.growth_rate_2030
			});
			regionI++;
		});

		Highcharts.chart('treemap-container', {
			series: [
				{
					name: 'Regions',
					type: 'treemap',
					layoutAlgorithm: 'squarified',
					allowDrillToNode: true,
					animationLimit: 1000,
					dataLabels: {
						enabled: false
					},
					levels: [
						{
							level: 1,
							dataLabels: {
								enabled: true
							},
							borderWidth: 3,
							levelIsConstant: false
						},
						{
							level: 1,
							dataLabels: {
								style: {
									fontSize: '14px'
								}
							}
						}
					],
					accessibility: {
						exposeAsGroupOnly: true
					},
					data: points,
					colorByPoint: true
				}
			],
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

	
	// Creacion del grafo de Radar que muestra los 3 campos de abajo
	function createRadarChart(data) {
        const countriesSet = new Set(data.map(entry => entry.geo));
        const countries = Array.from(countriesSet);
        
        const growth_2030 = data.map(entry => entry.growth_rate_2030);
        const growth_2040 = data.map(entry => entry.growth_rate_2040);
        const obs_values = data.map(entry => entry.obs_value);

        const ctx = document.getElementById('radarChart');
        const myChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: countries,
                datasets: [
					{
						label: 'GROWTH_2030',
						data: growth_2030,
						backgroundColor: 'rgba(255, 99, 132, 0.2)',
						borderColor: 'rgba(255, 99, 132, 1)',
						borderWidth: 1
					},
					{
						label: 'GROWTH_2040',
						data: growth_2040,
						backgroundColor: 'rgba(54, 162, 235, 0.2)',
						borderColor: 'rgba(54, 162, 235, 1)',
						borderWidth: 1
					},
					{
						label: 'OBS_VALUES',
						data: obs_values,
						backgroundColor: 'rgba(75, 192, 192, 0.2)',
						borderColor: 'rgba(75, 192, 192, 1)',
						borderWidth: 1
					}
				]
            },
            options: {
                scale: {
                    ticks: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

	onMount(async () => {
		await loadInitialGDP();
		await getGDP();
	});
</script>

<svelte:head>
	<!--- Importaciones -->
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/highcharts-more.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
	<script src="https://code.highcharts.com/modules/treemap.js"></script>
	<script src="https://code.highcharts.com/modules/heatmap.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</svelte:head>

<figure class="highcharts-figure">
	<div id="bubble-container"></div>
	<br />
	<div id="treemap-container"></div>
	<br />
	<canvas id="radarChart" width="400" height="400"></canvas>
</figure>
