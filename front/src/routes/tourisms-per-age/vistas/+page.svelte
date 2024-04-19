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
				align: 'left'
			},
			subtitle: {
				text:
					'Source: ' +
					'<a href="https://ofv.no/registreringsstatistikk"' +
					'target="_blank">EUROSTAT</a>',
				align: 'left'
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
		const xAxisCategories = Object.keys(yearsData);
		const seriesData = Object.values(yearsData);

		// Configurar el gráfico
		const chart = new Highcharts.Chart({
			chart: {
				renderTo: 'container2',
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
				text: 'Venta de coches por año en España',
				align: 'left'
			},
			subtitle: {
				text:
					'Source: ' +
					'<a href="https://ofv.no/registreringsstatistikk"' +
					'target="_blank">EUROSTAT</a>',
				align: 'left'
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

	onMount(async () => {
		getTourisms();
	});
</script>



<div id="container1" style="width:100%; height:400px;"></div>
<div id="container2" style="width: 100%; height: 400px;"></div>

