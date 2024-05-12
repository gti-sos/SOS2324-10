<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	//import * as echarts from 'echarts';
	let echarts = window.echarts;

	let API_MRF = '/api/v2/gdp-growth-rates';
	let API_MRF_I = '/proxyMRF1';
	let API_MRF_II = '/proxyMRF2';
	let API_MRF_III = '/proxyMRF3';
	let API_MRF_IV = '/proxyMRF4';

	let errorMsg = '';
	let gdp = [];

	let currentPage = 1;
	const pageSize = 10;
	let totalDatos = 0;
	let totalPages = 1;

	if (dev) {
		API_MRF = 'http://localhost:8080' + API_MRF;
		API_MRF_I = 'http://localhost:8080' + API_MRF_I;
		API_MRF_II = 'http://localhost:8080' + API_MRF_II;
		API_MRF_III = 'http://localhost:8080' + API_MRF_III;
		API_MRF_IV = 'http://localhost:8080' + API_MRF_IV;
	}

	async function getInitialGDP() {
		try {
			if (gdp.length === 0) {
				let response = await fetch(API_MRF + '/loadInitialData', {
					method: 'GET'
				});

				if (response.ok) {
					getGDP();
					exitoMsg = 'Datos cargados correctamente';
					errorMsg = '';
				} else {
					errorMsg = 'Ya existen datos en la base de datos';
				}
			} else {
				errorMsg = 'Ya existen datos en la base de datos';
			}
		} catch (e) {
			errorMsg = e;
		}
	}

	async function getGDP() {
		try {
			let offset = (currentPage - 1) * pageSize;
			let response = await fetch(`${API_MRF}?limit=${pageSize}&offset=${offset}`, {
				method: 'GET',
				headers: {
					'Cache-Control': 'no-cache',
					Pragma: 'no-cache'
				}
			});
			if (response.ok) {
				let data = await response.json();
				gdp = data;
				return gdp;
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

	// ------------------ INTEGRACIÓN I -----------------------

	async function API_MRF_First() {
		try {
			let response = await fetch(API_MRF_I, {
				method: 'GET',
				headers: {
					'Cache-Control': 'no-cache',
					Pragma: 'no-cache',
					'X-RapidAPI-Key': '77e71d3380msh154aec6377535a9p1b8f1ajsnec607687032a',
					'X-RapidAPI-Host': 'beers-list.p.rapidapi.com'
				}
			});

			if (response.ok) {
				let data = await response.json();
				return data;
			} else {
				if (response.status == 404) {
					errorMsg = 'Error: no hay datos';
				} else {
					errorMsg = `Error ${response.status}: ${response.statusText}`;
				}
			}
		} catch (e) {
			errorMsg = e;
		}
	}

	function modDataI(array1, array2) {
		//console.log("Datos del primer array:", array1);
		//console.log("Datos del segundo array:", array2);

		// Filtrar los países que están en ambas listas de datos
		const commonCountries = array1.filter((entry) => {
			return array2.some((item) => item.country === entry.geo);
		});
		//console.log("Países comunes:", commonCountries);

		// Obtener los países comunes y sus datos combinados
		const combinedData = commonCountries.map((country) => {
			const data1 = array1.find((entry) => entry.geo === country.geo);
			const countryBeers = array2.filter((item) => item.country === country.geo);
			const totalBeerCount = countryBeers.length; // Sumatorio de marcas de cerveza
			return {
				country: country.geo,
				growth_rate_2030: data1 ? data1.growth_rate_2030 : 0,
				beerCount: totalBeerCount
			};
		});
		//console.log("Datos combinados:", combinedData);

		return combinedData;
	}

	function createGraphI(data) {
		const chartDom = document.getElementById('graph1');
		const myChart = echarts.init(chartDom);
		const option = {
			title: {
				text: 'Growth Rate 2030 vs. Beer Count by Country'
			},
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: ['Growth Rate 2030', 'Beer Count']
			},
			toolbox: {
				show: true,
				feature: {
					saveAsImage: {}
				}
			},
			xAxis: {
				type: 'category',
				data: data.map((entry) => entry.country)
			},
			yAxis: [
				{
					type: 'value',
					name: 'Growth Rate 2030',
					position: 'left'
				},
				{
					type: 'value',
					name: 'Beer Count',
					position: 'right'
				}
			],
			series: [
				{
					name: 'Growth Rate 2030',
					type: 'bar',
					yAxisIndex: 0,
					data: data.map((entry) => entry.growth_rate_2030)
				},
				{
					name: 'Beer Count',
					type: 'bar',
					yAxisIndex: 1,
					data: data.map((entry) => entry.beerCount)
				}
			]
		};
		option && myChart.setOption(option);
	}

	// ------------------ INTEGRACIÓN II -----------------------

	async function API_MRF_Second() {
		try {
			let response = await fetch(API_MRF_II, {
				method: 'GET',
				headers: {
					'Cache-Control': 'no-cache',
					Pragma: 'no-cache',
					'X-RapidAPI-Key': '77e71d3380msh154aec6377535a9p1b8f1ajsnec607687032a',
					'X-RapidAPI-Host': 'deaths-by-european-countries.p.rapidapi.com'
				}
			});

			if (response.ok) {
				let data = await response.json();
				return data;
			} else {
				if (response.status == 404) {
					errorMsg = 'Error: no hay datos';
				} else {
					errorMsg = `Error ${response.status}: ${response.statusText}`;
				}
			}
		} catch (e) {
			errorMsg = e;
		}
	}

	function modDataII(array1, array2) {
		// Filtrar los países que están en ambas listas de datos
		const commonCountries = array1.filter((entry1) =>
			array2.some((entry2) => entry2.geo === entry1.geo)
		);

		// Obtener los países comunes y sus datos combinados
		const combinedData = commonCountries.map((country) => {
			const data1 = array1.find((entry) => entry.geo === country.geo);
			const data2 = array2.find((entry) => entry.geo === country.geo);
			return {
				country: country.geo,
				growth_rate_2030: data1 ? data1.growth_rate_2030 : 0,
				deaths_2020: data2 ? data2.deaths_2020 : 0
			};
		});

		return combinedData;
	}

	function createGraphII(data) {
		// Preparar los datos para el gráfico de radar
		let countries = data.map((item) => item.country);
		let growthRates = data.map((item) =>
			item.growth_rate_2030 !== null ? item.growth_rate_2030 : 0
		);
		let deaths = data.map((item) => (item.deaths_2020 !== null ? item.deaths_2020 : 0));

		// Inicializar el gráfico de radar
		const myChart = echarts.init(document.getElementById('graph2'));

		// Configurar las opciones del gráfico de radar
		const option = {
			title: {
				text: 'Growth Rate and Deaths per Country'
			},
			legend: {
				data: ['Growth Rate 2030', 'Deaths 2020']
			},
			radar: {
				// shape: 'circle',
				indicator: countries.map((country) => ({ name: country }))
			},
			series: [
				{
					name: 'Growth Rate vs Deaths',
					type: 'radar',
					data: [
						{
							value: growthRates,
							name: 'Growth Rate 2030'
						},
						{
							value: deaths,
							name: 'Deaths 2020'
						}
					]
				}
			]
		};

		// Establecer las opciones y renderizar el gráfico
		myChart.setOption(option);
	}

	// ------------------ USO III -----------------------

	async function API_MRF_Third() {
		try {
			let response = await fetch(API_MRF_III, {
				method: 'GET',
				headers: {
					'Cache-Control': 'no-cache',
					Pragma: 'no-cache',
					'X-RapidAPI-Key': '77e71d3380msh154aec6377535a9p1b8f1ajsnec607687032a',
					'X-RapidAPI-Host': 'cancer-rates-by-usa-state.p.rapidapi.com'
				}
			});

			if (response.ok) {
				let data = await response.json();
				return data;
			} else {
				if (response.status == 404) {
					errorMsg = 'Error: no hay datos';
				} else {
					errorMsg = `Error ${response.status}: ${response.statusText}`;
				}
			}
		} catch (e) {
			errorMsg = e;
		}
	}

	function createGraphIII(data) {
		// Filtra los datos para eliminar la entrada con id nulo y el estado vacío
		const filteredData = data.filter((item) => item.Range && item.State);

		// Configura los datos para el treemap en ECharts
		const treemapData = filteredData.map((item) => {
			const range = item.Range.split(' to ');
			const minValue = parseFloat(range[0]);
			const maxValue = parseFloat(range[1]);
			const size = maxValue - minValue;
			return {
				name: item.State,
				value: size // Tamaño del cuadrado basado en el rango
			};
		});

		// Configura el gráfico de treemap en ECharts
		const myChart = echarts.init(document.getElementById('graph3'));

		const option = {
			series: [
				{
					type: 'treemap',
					data: treemapData
				}
			]
		};

		// Renderiza el gráfico
		myChart.setOption(option);
	}

	// ------------------ USO IV -----------------------

	async function API_MRF_Forth() {
		try {
			let response = await fetch(API_MRF_IV, {
				method: 'GET',
				headers: {
					'Cache-Control': 'no-cache',
					Pragma: 'no-cache',
					'X-RapidAPI-Key': '77e71d3380msh154aec6377535a9p1b8f1ajsnec607687032a',
					'X-RapidAPI-Host': 'everyearthquake.p.rapidapi.com'
				}
			});

			if (response.ok) {
				let data = await response.json();
				return data;
			} else {
				if (response.status == 404) {
					errorMsg = 'Error: no hay datos';
				} else {
					errorMsg = `Error ${response.status}: ${response.statusText}`;
				}
			}
		} catch (e) {
			errorMsg = e;
		}
	}

	function createGraphIV(data) {
		var chartDom = document.getElementById('graph4');
		var myChart = echarts.init(chartDom);
		var option;

		// Convertir los datos en el formato requerido para el gráfico Sankey
		var nodos = [];
		var enlaces = [];
		var contador = 0;

		data.forEach(function (item) {
			if (item.geo !== '') {
				nodos.push({ name: item.geo });
				enlaces.push({
					source: contador,
					target: nodos.length - 1,
					value: parseFloat(item.magnitude)
				});
			} else {
				contador++;
			}
		});

		// Configuración del gráfico Sankey
		option = {
			series: {
				type: 'sankey',
				layout: 'none',
				emphasis: {
					focus: 'adjacency'
				},
				data: nodos,
				links: enlaces
			}
		};

		// Establecer opciones y renderizar el gráfico
		option && myChart.setOption(option);
	}
	// -------------------- CARGA DE DATOS -----------------

	async function initDatos() {
		await getInitialGDP();
		let datos_MRF = await getGDP();
		let datosI = await API_MRF_First();
		let datosII = await API_MRF_Second();
		let datosIII = await API_MRF_Third();
		let datosIV = await API_MRF_Forth();

		let graphDataI = modDataI(datos_MRF, datosI);
		createGraphI(graphDataI);

		let graphDataII = modDataII(datos_MRF, datosII);
		createGraphII(graphDataII);

		createGraphIII(datosIII);

		createGraphIV(datosIV);
	}

	onMount(async () => {
		initDatos();
	});
</script>

<div id="graph1" style="width: 800px; height: 600px;"></div>
<div id="graph2" style="width: 800px; height: 600px;"></div>
<div id="graph3" style="width: 800px; height: 600px;"></div>
<div id="graph4" style="width: 800px; height: 600px;"></div>

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/chart.js@3.7.0"></script>
	<script src="https://cdn.jsdelivr.net/npm/echarts@latest/dist/echarts.min.js"></script>
</svelte:head>
