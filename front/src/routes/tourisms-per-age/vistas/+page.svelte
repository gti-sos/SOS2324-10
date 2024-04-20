<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/highcharts-3d.js"></script>
	<script src="https://code.highcharts.com/modules/exporting.js"></script>
	<script src="https://code.highcharts.com/modules/export-data.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let API_ASC = '/api/v2/tourisms-per-age';
	let errMsg = '';

	if (dev) {
		API_ASC = 'http://localhost:8080' + API_ASC;
	}

	async function getTourisms() {
		try {
			let response = await fetch(`${API_ASC}?limit=10000`, {
				method: 'GET'
			});

			if (response.ok) {
				let data = await response.json();
				graf1(data);
				graf2(data);
                graf3(data);
				return data;
			} else {
				if (response.status == 404) {
					errMsg = 'No hay datos en la base de datos';
				} else {
					errMsg = `Error ${response.status}: ${response.statusText}`;
				}
			}
		} catch (e) {
			errMsg = e;
		}
	}

	function graf1(data) {
		// Crear un objeto para almacenar los datos agrupados por país
		const countriesData = {};

		// Iterar sobre los datos recibidos y agruparlos por país
		data.forEach((item) => {
			const { geo, obs_value } = item;
			if (!countriesData[geo]) {
				countriesData[geo] = [];
			}
			countriesData[geo].push(obs_value);
		});

		// Calcular la media de obs_value por país
		const countriesAverageData = {};
		for (const country in countriesData) {
			const obsValues = countriesData[country];
			const totalObsValue = obsValues.reduce((acc, cur) => acc + cur, 0);
			const averageObsValue = totalObsValue / obsValues.length;
			countriesAverageData[country] = averageObsValue;
		}

		// Preparar los datos para Highcharts
		const xAxisCategories = Object.keys(countriesAverageData);
		const seriesData = Object.values(countriesAverageData);

		// Configurar el gráfico
		const chart = new Highcharts.Chart({
			chart: {
				renderTo: 'container1',
				type: 'column',
				options3d: {
					enabled: true,
					alpha: 15,
					beta: 15,
					depth: 50,
					viewDistance: 25
				}
			},
			xAxis: {
				categories: xAxisCategories
			},
			yAxis: {
				title: {
					enabled: false
				}
			},
			tooltip: {
				headerFormat: '<b>{point.key}</b><br>',
				pointFormat: 'Coches vendidos: {point.y}'
			},
			title: {
				text: 'Media de coches vendidos por país',
				
			},
			subtitle: {
				text:
					'Source: ' +
					'<a href="https://ofv.no/registreringsstatistikk"' +
					'target="_blank">EUROSTAT</a>'
			},
			legend: {
				enabled: false
			},
			plotOptions: {
				column: {
					depth: 25
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

	function graf2(data) {
		// Filtrar los datos por Bulgaria (BG) y España (ES)
		const filteredData = data.filter((item) => item.geo === 'BG' || item.geo === 'ES');

		// Crear un objeto para almacenar los datos agrupados por país y año
		const countriesData = {};

		// Iterar sobre los datos filtrados y agruparlos por país y año
		filteredData.forEach((item) => {
			const { geo, time_period, obs_value } = item;
			if (!countriesData[geo]) {
				countriesData[geo] = {};
			}
			if (!countriesData[geo][time_period]) {
				countriesData[geo][time_period] = 0;
			}
			countriesData[geo][time_period] += obs_value;
		});

		// Preparar los datos para Highcharts
		const seriesData = Object.entries(countriesData).map(([country, yearsData]) => ({
			name: country,
			data: Object.entries(yearsData).map(([year, value]) => ({
				name: year,
				y: value
			}))
		}));

		// Configurar el gráfico Highcharts
		Highcharts.chart('container2', {
			chart: {
				type: 'area'
			},
			title: {
				text: 'Venta de coches por país y año'
			},
			subtitle: {
				text: 'Source: ' + '<a href="https://yoursource.com" target="_blank">EUROSTAT</a>'
			},
			xAxis: {
				allowDecimals: false,
				accessibility: {
					rangeDescription: 'Range: 2016 to 2021.'
				}
			},
			yAxis: {
				title: {
					text: 'Número de coches vendidos'
				}
			},
			tooltip: {
				pointFormat: '{series.name} vendió <b>{point.y:,.0f}</b><br/>coches en {point.x}'
			},
			plotOptions: {
				area: {
					pointStart: 2016, // Se asume que comienza en 2010, ajustar si es diferente
					marker: {
						enabled: false,
						symbol: 'circle',
						radius: 2,
						states: {
							hover: {
								enabled: true
							}
						}
					}
				}
			},
			series: seriesData
		});
	}
	function graf3(data) {
		// Filtrar los datos por geo === 'ES'
		const filteredData = data.filter((item) => item.geo === 'ES');

		// Crear un objeto para almacenar los datos agrupados por año
		const yearsData = {};

		// Iterar sobre los datos filtrados y agruparlos por año
		filteredData.forEach((item) => {
			const { time_period, obs_value } = item;
			if (!yearsData[time_period]) {
				yearsData[time_period] = 0;
			}
			yearsData[time_period] += obs_value;
		});

		// Preparar los datos para Highcharts
		const seriesData = [];
		for (const year in yearsData) {
			seriesData.push([year, yearsData[year]]);
		}

		// Configurar el gráfico
		const chart = new Highcharts.Chart({
			chart: {
				renderTo: 'container3', // Contenedor para la segunda gráfica
				type: 'pie',
				options3d: {
					enabled: true,
					alpha: 45
				}
			},
			title: {
				text: 'Venta de coches por año en España',
			},
			subtitle: {
				text: 'Source: ' + '<a href="https://yoursource.com" target="_blank">EUROSTAT</a>'
			},
			plotOptions: {
				pie: {
					innerSize: 100,
					depth: 45
				}
			},
			series: [
				{
					name: 'Numero de coches vendidos',
					data: seriesData
				}
			]
		});
	}

	onMount(async () => {
		getTourisms();
	});
</script>



<div id="container1" style="width:100%; height:400px;"></div>
<div id="container2" style="width: 100%; height: 400px;"></div>
<div id="container3" style="width: 100%; height: 400px;"></div>


<style>
	/* Estilos para la primera gráfica */
	#container1,
	#container2,
    #container3 {
		height: 400px;
		width: 100%;
		margin: 1em auto;
	}

	.highcharts-figure,
	.highcharts-data-table table {
		min-width: 310px;
		max-width: 800px;
		margin: 1em auto;
	}

	#sliders td input[type='range'] {
		display: inline;
	}

	#sliders td {
		padding-right: 1em;
		white-space: nowrap;
	}

	/* Estilos específicos para el gráfico de dispersión 3D */
	.scatter-container {
		height: 600px;
		width: 100%;
		margin: 0 auto;
	}
</style>
