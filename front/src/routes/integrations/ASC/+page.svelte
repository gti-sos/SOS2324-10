<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let API_ASC = '/api/v2/tourisms-per-age';
	let API_ASC1 = '/proxyASC1';
	let API_ASC2 = '/proxyASC2';
	let API_ASC3 = '/proxyASC3';
	let errorMsg = '';

	if (dev) {
		API_ASC = 'http://localhost:8080' + API_ASC;
		API_ASC1 = 'http://localhost:8080' + API_ASC1;
		API_ASC2 = 'http://localhost:8080' + API_ASC2;
		API_ASC3 = 'http://localhost:8080' + API_ASC3;
	}

	// 1er gráfico
	async function API_ASC_1() {
		try {
			let response = await fetch(API_ASC1, {
				method: 'GET'
			});

			if (response.ok) {
				let data = await response.json();
				console.log(data);
				let covidData = transformData1(data);
				console.log(covidData);
				crearGrafico1(covidData);
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

	function transformData1(data) {
		console.log(data); // Verificamos que los datos se estén recibiendo correctamente

		// Utilizamos reduce para agrupar los datos por provincia y contar las muertes por COVID-19 en cada provincia
		const countryData = data.data.reduce((acc, curr) => {
			// Accedemos a la propiedad region.province para obtener el nombre de la provincia
			const province = curr.region.province;

			// Verificamos si la provincia ya está en el acumulador
			if (!acc[province]) {
				acc[province] = { deaths: 0 };
			}

			// Sumamos las muertes al contador de muertes de la provincia actual
			acc[province].deaths += curr.deaths || 0;

			return acc;
		}, {});

		// Convertimos los datos agrupados en un arreglo de objetos con la estructura necesaria para la gráfica
		const sortedData = Object.entries(countryData).map(([province, data]) => ({
			province,
			deaths: data.deaths
		}));

		// Ordenamos los datos por el número de muertes en orden descendente
		sortedData.sort((a, b) => b.deaths - a.deaths);

		// Creamos el objeto chartData con las categorías (provincias) y la serie de datos (muertes)
		const chartData = {
			categories: sortedData.map((item) => item.province),
			series: sortedData.map((item) => ({
				deaths: item.deaths
			}))
		};

		console.log(chartData); // Verificamos que los datos transformados sean correctos

		return chartData;
	}

	function crearGrafico1(chartData) {
		// Excluir el último elemento de la lista
		const dataLength = chartData.categories.length;
		const dataPoints = chartData.categories.slice(0, dataLength - 1).map((category, index) => {
			return {
				label: category,
				y: chartData.series[index].deaths
			};
		});

		let options = {
			animationEnabled: true,
			title: {
				text: 'Muertes de COVID-19 por provincia en España'
			},
			data: [
				{
					type: 'pie',
					showInLegend: true,
					legendText: '{label}',
					indexLabel: '{label}: {y}',
					dataPoints: dataPoints
				}
			]
		};

		let chart = new CanvasJS.Chart('chart1', options);
		chart.render();
	}

	// 2do gráfico
	async function API_ASC_2() {
		try {
			let response = await fetch(API_ASC2, {
				method: 'GET'
			});

			if (response.ok) {
				let data = await response.json();
				console.log(data);
				let weatherData = transformWeatherData(data);
				console.log(weatherData);
				crearGrafico2(weatherData);
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

	function transformWeatherData(data) {
		return data.forecast5Day.map((day) => ({
			label: day.dayOfWeek,
			am: parseInt(day.am.maxTemp.replace('°F', '')),
			pm: parseInt(day.pm.maxTemp.replace('°F', '')),
			night: parseInt(day.night.maxTemp.replace('°F', ''))
		}));
	}

	function crearGrafico2(chartData) {
		var chart = new CanvasJS.Chart('chartContainer', {
			animationEnabled: true,
			title: {
				text: 'Pronóstico Meteorológico Semanal'
			},
			axisX: {
				title: 'Día de la Semana'
			},
			axisY: {
				title: 'Temperatura (°F)'
			},
			toolTip: {
				shared: true
			},
			legend: {
				cursor: 'pointer',
				verticalAlign: 'top',
				horizontalAlign: 'center',
				dockInsidePlotArea: true,
				itemclick: toogleDataSeries
			},
			data: [
				{
					type: 'column',
					name: 'Mañana',
					showInLegend: true,
					dataPoints: chartData.map((data) => ({ label: data.label, y: data.am }))
				},
				{
					type: 'column',
					name: 'Tarde',
					showInLegend: true,
					dataPoints: chartData.map((data) => ({ label: data.label, y: data.pm }))
				},
				{
					type: 'column',
					name: 'Noche',
					showInLegend: true,
					dataPoints: chartData.map((data) => ({ label: data.label, y: data.night }))
				}
			]
		});
		chart.render();
	}

	// Función auxiliar para alternar la visualización de las series de datos en el gráfico
	function toogleDataSeries(e) {
		if (typeof e.dataSeries.visible === 'undefined' || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		} else {
			e.dataSeries.visible = true;
		}
		e.chart.render();
	}

	// 3er gráfico
	async function API_ASC_3() {
		try {
			let response = await fetch(API_ASC3, {
				method: 'GET'
			});

			if (response.ok) {
				let data = await response.json();
				let gamesData = transformgamesData(data);
				crearGrafico3(gamesData);
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

	function transformgamesData(data) {
		// Mapear los datos para obtener solo el nombre externo y el precio más barato
		return data.map((item) => ({
			externalName: item.external,
			cheapestPrice: parseFloat(item.cheapest)
		}));
	}

	function crearGrafico3(gamesData) {
		let chartData = gamesData.map((item) => ({
			y: item.cheapestPrice,
			label: item.externalName
		}));

		let options = {
			animationEnabled: true,
			title: {
				text: 'Precios más baratos de juegos'
			},
			axisX: {
				title: 'Nombre externo del juego'
			},
			axisY2: {
				interlacedColor: 'rgba(1,77,101,.2)',
				gridColor: 'rgba(1,77,101,.1)',
				title: 'Precio más barato'
			},
			data: [
				{
					type: 'bar',
					name: 'Precio más barato',
					color: '#014D65',
					axisYType: 'secondary',
					dataPoints: chartData
				}
			]
		};

		let chart = new CanvasJS.Chart('chartContainer2', options);
		chart.render();
	}

	onMount(async () => {
		await API_ASC_1();
		await API_ASC_2();
		await API_ASC_3();
	});
</script>

<svelte:head>
	<script src="https://cdn.canvasjs.com/canvasjs.min.js"></script>
</svelte:head>

<div id="chart1" style="height: 300px; width: 100%;"></div>
<div id="chartContainer" style="height: 300px; width: 100%;"></div>
<div id="chartContainer2" style="height: 300px; width: 100%;"></div>

