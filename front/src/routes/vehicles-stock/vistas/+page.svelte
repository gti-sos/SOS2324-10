<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let API_TLR = '/api/v2/vehicles-stock';
	let errorMsg = '';

	if (dev) {
		API_TLR = 'http://localhost:8080' + API_TLR;
	}

	async function getVehicles() {
		try {
			let response = await fetch(`${API_TLR}?limit=10000`, {
				method: 'GET',
				headers: {
					'Cache-Control': 'no-cache',
					Pragma: 'no-cache'
				}
			});

			if (response.ok) {
				let data = await response.json();
				return data;
			} else {
				if (response.status == 404) {
					errorMsg = 'No hay datos en la base de datos';
				} else {
					errorMsg = `Error ${response.status}: ${response.statusText}`;
				}
			}
		} catch (e) {
			errorMsg = e;
		}
	}

	async function getChart() {
		let datos = await getVehicles();
		const chartData = transformData(datos);
		const chart = Highcharts.chart('graph', {
			chart: {
				type: 'bar'
			},
			title: {
				text: 'Ventas de vehículos por país'
			},
			xAxis: {
				categories: chartData.categories,
				title: {
					text: 'Países'
				}
			},
			yAxis: {
				title: {
					text: 'Número de vehículos vendidos'
				}
			},
			plotOptions: {
				series: {
					color: '#3E92CC',
					cursor: 'pointer',
					events: {
						click: function (event) {
							showCountryChart(event.point.category);
						}
					}
				}
			},
			series: [
				{
					name: 'Total de vehículos vendidos',
					data: chartData.series
				}
			]
		});
	}

	function transformData(datos) {
		const countrySales = datos.reduce((acc, curr) => {
			if (!acc[curr.geo]) {
				acc[curr.geo] = 0;
			}
			acc[curr.geo] += curr.obs_value;
			return acc;
		}, {});

		const sortedData = Object.entries(countrySales).map(([country, totalSales]) => ({
			country,
			totalSales
		}));

		sortedData.sort((a, b) => b.totalSales - a.totalSales);

		const chartData = {
			categories: sortedData.map((item) => item.country),
			series: sortedData.map((item) => item.totalSales)
		};

		return chartData;
	}

	function showCountryChart(country) {
		const countryData = datos.filter((item) => item.geo === country);
		const countryChartData = transformCountryData(countryData);

		Highcharts.chart('countryGraph', {
			chart: {
				type: 'bar'
			},
			title: {
				text: `Ventas de vehículos en ${country}`
			},
			xAxis: {
				categories: countryChartData.categories,
				title: {
					text: 'Año'
				}
			},
			yAxis: {
				title: {
					text: 'Número de vehículos vendidos'
				}
			},
			plotOptions: {
				series: {
					color: '#FFA500' // Cambiamos el color de las barras a naranja
				}
			},
			series: [
				{
					name: 'Ventas por año',
					data: countryChartData.series
				}
			]
		});
	}

	function transformCountryData(countryData) {
		const chartData = {
			categories: [],
			series: []
		};

		countryData.forEach((item) => {
			chartData.categories.push(item.year);
			chartData.series.push(item.obs_value);
		});

		return chartData;
	}

	let datos;

	onMount(async () => {
		datos = await getVehicles();
		getChart();
	});
</script>

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
</svelte:head>

<div class="container">
	<div class="graph1">
		<div id="graph" style="width:100%; height:400px;"></div>
	</div>

	<div class="graph2">
		<div id="countryGraph" style="width:100%; height:400px;"></div>
	</div>
</div>

<style>
	.container {
		width: 100%;
		height: 100%;
		margin: 50px auto;
		background-color: #89deff;
		color: #333;
		border: 1px solid #89deff;
		border-radius: 15px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		padding: 20px;
	}

	.graph1 {
		width: 80%;
		margin: 50px auto;
		background-color: #ffffff; /* Blanco */
		border: 1px solid #a4caef; /* Azul claro */
		border-radius: 15px; /* Bordes más redondeados */
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Sombras */
		padding: 20px;
	}
	.graph2 {
		width: 80%;
		margin: 50px auto;
		background-color: #ffffff; /* Blanco */
		border: 1px solid #a4caef; /* Azul claro */
		border-radius: 15px; /* Bordes más redondeados */
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Sombras */
		padding: 20px;
	}
</style>