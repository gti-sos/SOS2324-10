<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import * as echarts from 'echarts';

	let API_TLR = '/api/v2/vehicles-stock';
	let API_TLR1 = '/proxyTLR1';
	let API_TLR2 = '/proxyTLR2';
	let API_TLR3 = '/proxyTLR3';
	let errorMsg = '';
	let datos = {};
	if (dev) {
		API_TLR = 'http://localhost:8080' + API_TLR;
		API_TLR1 = 'http://localhost:8080' + API_TLR1;
		API_TLR2 = 'http://localhost:8080' + API_TLR2;
		API_TLR3 = 'http://localhost:8080' + API_TLR3;
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

	async function API_TLR_1() {
		try {
			let response = await fetch(API_TLR1, {
				method: 'GET',
				headers: {
					'Cache-Control': 'no-cache',
					Pragma: 'no-cache',
					'X-RapidAPI-Key': '1aadf5ce53msh199300bed84e271p129a87jsn45a312038c14',
					'X-RapidAPI-Host': 'car-api2.p.rapidapi.com'
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

	async function API_TLR_2() {
		try {
			let response = await fetch(API_TLR2, {
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

	async function API_TLR_3() {
		try {
			let response = await fetch(API_TLR3, {
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

	function unificarBD(datos1, datos2, datos3, datos4) {
		const geoSet1 = new Set(datos1.map((item) => item.geo));
		const geoSet2 = new Set(datos2.map((item) => item.geo));
		const geoSet3 = new Set(datos3.map((item) => item.geo));
		const geoSet4 = new Set(datos4.map((item) => item.geo));

		const commonGeoSet = new Set(
			[...geoSet1].filter((geo) => geoSet2.has(geo) && geoSet3.has(geo) && geoSet4.has(geo))
		);

		// Filtrar datos para incluir solo países comunes
		const filteredData1 = datos1.filter((item) => commonGeoSet.has(item.geo));
		const filteredData2 = datos2.filter((item) => commonGeoSet.has(item.geo));
		const filteredData3 = datos3.filter((item) => commonGeoSet.has(item.geo));
		const filteredData4 = datos4.filter((item) => commonGeoSet.has(item.geo));

		// Combinar todos los datos filtrados
		const combinedData = [...filteredData1, ...filteredData2, ...filteredData3, ...filteredData4];

		return combinedData;
	}
	function geoEspana(arrayObjetos) {
		// Diccionario de traducciones
		let traducciones = {
			'United Emirates': 'Emiratos Árabes Unidos',
			Argentina: 'Argentina',
			Austria: 'Austria',
			Australia: 'Australia',
			Azerbaijan: 'Azerbaiyán',
			Belgium: 'Bélgica',
			Bulgaria: 'Bulgaria',
			Brazil: 'Brasil',
			Canada: 'Canadá',
			Switzerland: 'Suiza',
			Chile: 'Chile',
			Colombia: 'Colombia',
			Cyprus: 'Chipre',
			'Czech Republic': 'República Checa',
			Germany: 'Alemania',
			Denmark: 'Dinamarca',
			Ecuador: 'Ecuador',
			Estonia: 'Estonia',
			Spain: 'España',
			Finland: 'Finlandia',
			France: 'Francia',
			'United Kingdom': 'Reino Unido',
			Greece: 'Grecia',
			'Hong Kong': 'Hong Kong',
			Croatia: 'Croacia',
			Hungary: 'Hungría',
			Indonesia: 'Indonesia',
			Ireland: 'Irlanda',
			Israel: 'Israel',
			India: 'India',
			Iceland: 'Islandia',
			Italy: 'Italia',
			Japan: 'Japón',
			'South Korea': 'Corea del Sur',
			Lithuania: 'Lituania',
			Moldova: 'Moldavia',
			'North Macedonia': 'Macedonia del Norte',
			Mexico: 'México',
			Malaysia: 'Malasia',
			Netherlands: 'Países Bajos',
			Norway: 'Noruega',
			'New Zealand': 'Nueva Zelanda',
			Panama: 'Panamá',
			Peru: 'Perú',
			Philippines: 'Filipinas',
			Poland: 'Polonia',
			Portugal: 'Portugal',
			Romania: 'Rumania',
			Serbia: 'Serbia',
			Russia: 'Rusia',
			Sweden: 'Suecia',
			Singapore: 'Singapur',
			Slovenia: 'Eslovenia',
			Thailand: 'Tailandia',
			Turkey: 'Turquía',
			Ukraine: 'Ucrania',
			'United States': 'Estados Unidos',
			Vietnam: 'Vietnam',
			'South Africa': 'Sudáfrica'
		};

		for (let i = 0; i < arrayObjetos.length; i++) {
			let objeto = arrayObjetos[i];

			// Si el valor de 'geo' existe en el diccionario de traducciones, cambiarlo
			if (traducciones[objeto.geo]) {
				objeto.geo = traducciones[objeto.geo];
			}
		}

		return arrayObjetos;
	}

	function transformData1(datos) {
		const countryData = datos.reduce((acc, curr) => {
			if (!acc[curr.geo]) {
				acc[curr.geo] = { flights_passangers: 0, deaths: 0 };
			}
			if (curr.flights_passangers) {
				acc[curr.geo].flights_passangers += curr.flights_passangers;
			}
			if (curr.deaths) {
				acc[curr.geo].deaths += curr.deaths;
			}
			return acc;
		}, {});

		const sortedData = Object.entries(countryData).map(([country, data]) => ({
			country,
			flights_passangers: data.flights_passangers,
			deaths: data.deaths
		}));

		sortedData.sort((a, b) => b.flights_passangers - a.flights_passangers);

		const chartData = {
			categories: sortedData.map((item) => item.country),
			series: sortedData.map((item) => ({
				flights_passangers: item.flights_passangers,
				deaths: item.deaths
			}))
		};

		return chartData;
	}

	function crearGrafico1(chartData) {
		// Inicializar echarts
		let myChart = echarts.init(document.getElementById('graph01'));

		// Opciones para el gráfico
		let option = {
			title: {
				text: 'Datos por país'
			},
			tooltip: {},
			legend: {
				data: ['Pasajeros de vuelo', 'Muertes por Covid']
			},
			xAxis: {
				data: chartData.categories
			},
			yAxis: {},
			series: [
				{
					name: 'Pasajeros de vuelo',
					type: 'bar',
					data: chartData.series.map((item) => item.flights_passangers)
				},
				{
					name: 'Muertes por Covid',
					type: 'bar',
					data: chartData.series.map((item) => item.deaths)
				}
			]
		};

		myChart.setOption(option);
	}

	function transformData2(datos) {
		const currencyCounts = datos.reduce((acc, curr) => {
			if (curr.currency) {
				acc[curr.currency] = (acc[curr.currency] || 0) + 1;
			}
			return acc;
		}, {});

		const filteredCounts = Object.entries(currencyCounts)
			.filter(([currency, count]) => count >= 3)
			.reduce((acc, [currency, count]) => {
				acc[currency] = count;
				return acc;
			}, {});

		return filteredCounts;
	}

	function crearGrafico2(currencyCounts) {
		// Inicializar echarts
		let myChart = echarts.init(document.getElementById('graph02'));

		// Preparar los datos para el gráfico
		const data = Object.entries(currencyCounts).map(([currency, count]) => ({
			name: currency,
			value: count
		}));

		// Opciones para el gráfico
		let option = {
			title: {
				text: 'Uso de Monedas en países',
				left: 'center'
			},
			tooltip: {
				trigger: 'item'
			},
			legend: {
				orient: 'vertical',
				left: 'right'
			},
			series: [
				{
					name: 'Usado en distintos países',
					type: 'pie',
					radius: '50%',
					data: data,
					emphasis: {
						itemStyle: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
				}
			]
		};

		// Usar las opciones especificadas para el gráfico
		myChart.setOption(option);
	}

	async function inicializarDatos() {
		let datos_TLR = await getVehicles();
		let datos1 = await API_TLR_1();
		let datos2 = await API_TLR_2();
		let datos3 = await API_TLR_3();

		datos1 = geoEspana(datos1);
		datos2 = geoEspana(datos2);
		datos3 = geoEspana(datos3);

		datos = unificarBD(datos_TLR, datos1, datos2, datos3);
		console.log(datos);

		let chartData1 = transformData1(datos);
		console.log('Datos graph01: ' + JSON.stringify(chartData1));
		crearGrafico1(chartData1);

		let chartData2 = transformData2(datos3);
		crearGrafico2(chartData2);
	}

	onMount(async () => {
		inicializarDatos();
	});
</script>

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
	<script src="https://d3js.org/d3.v7.min.js"></script>
</svelte:head>

<div class="container">
	<div class="graph1">
		<div id="graph01" style="width:100%; height:400px;"></div>
	</div>

	<div class="graph1">
		<div id="graph02" style="width:100%; height:400px;"></div>
	</div>
</div>

<style>
	.container {
		width: 100%;
		height: 100%;

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

	.message {
		text-align: center;
	}

	.message span {
		font-size: 24px;
		color: #ff0000;
	}
</style>
