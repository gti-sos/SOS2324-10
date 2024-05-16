<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	//import * as echarts from 'echarts';
	let echarts = window.echarts;

	let API_TLR = '/api/v2/vehicles-stock';
	let API_TLR1 = '/proxyTLR1';
	let API_TLR2 = '/proxyTLR2';
	let API_TLR3 = '/proxyTLR3';
	let API_TLR4 = '/proxyTLR4';
	let errorMsg = '';
	let datos = {};

	

	if (dev) {
		API_TLR = 'http://localhost:8080' + API_TLR;
		API_TLR1 = 'http://localhost:8080' + API_TLR1;
		API_TLR2 = 'http://localhost:8080' + API_TLR2;
		API_TLR3 = 'http://localhost:8080' + API_TLR3;
		API_TLR4 = 'http://localhost:8080' + API_TLR4;
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
				console.log('Datos obtenidos de API_TLR');g
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
		console.log('Llamada a BD API_TLR_1');
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
				console.log('Respuesta API_TLR_1');
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

	async function API_TLR_4() {
		try {
			let response = await fetch(API_TLR4, {
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
		console.log(geoSet1);
		const geoSet2 = new Set(datos2.map((item) => item.geo));
		console.log(geoSet2);
		const geoSet3 = new Set(datos3.map((item) => item.geo));
		console.log(geoSet3);
		const geoSet4 = new Set(datos4.map((item) => item.geo));
		console.log(geoSet4);

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

	// Función que transforma los datos para su visualización en un gráfico
	function transformData1(datos) {
		// Paso 1: Reducir los datos a un objeto que contenga la suma de pasajeros de vuelo y muertes por país
		const countryData = datos.reduce((acc, curr) => {
			if (!acc[curr.geo]) {
				acc[curr.geo] = { flights_passangers: 0, deaths: 0 }; // Inicializar si no existe
			}
			if (curr.flights_passangers) {
				acc[curr.geo].flights_passangers += curr.flights_passangers; // Sumar pasajeros de vuelo por país
			}
			if (curr.deaths) {
				acc[curr.geo].deaths += curr.deaths; // Sumar muertes por país
			}
			return acc;
		}, {});

		// Paso 2: Convertir el objeto countryData en un array de objetos con el formato adecuado
		const sortedData = Object.entries(countryData).map(([country, data]) => ({
			country,
			flights_passangers: data.flights_passangers,
			deaths: data.deaths
		}));

		// Paso 3: Ordenar el array de objetos en función del número de pasajeros de vuelo (de mayor a menor)
		sortedData.sort((a, b) => b.flights_passangers - a.flights_passangers);

		// Paso 4: Preparar los datos para el gráfico
		const chartData = {
			categories: sortedData.map((item) => item.country), // Obtener los países
			series: sortedData.map((item) => ({
				flights_passangers: item.flights_passangers, // Obtener los pasajeros de vuelo por país
				deaths: item.deaths // Obtener las muertes por país
			}))
		};

		// Paso 5: Devolver los datos preparados para el gráfico
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

	// Función para transformar los datos relacionados con la moneda
	function transformData2(datos) {
		// Reducción de los datos para contar la frecuencia de cada moneda
		const currencyCounts = datos.reduce((acc, curr) => {
			// Verificar si el dato tiene información sobre la moneda
			if (curr.currency) {
				// Incrementar el contador de la moneda en el acumulador
				acc[curr.currency] = (acc[curr.currency] || 0) + 1;
			}
			return acc;
		}, {});

		// Filtrar las cuentas de moneda para incluir solo aquellas que tienen al menos 3 ocurrencias
		const filteredCounts = Object.entries(currencyCounts)
			.filter(([currency, count]) => count >= 3) // Filtrar las entradas con al menos 3 ocurrencias
			.reduce((acc, [currency, count]) => {
				// Reducir los datos filtrados a un objeto con las cuentas de moneda filtradas
				acc[currency] = count; // Asignar el contador al acumulador
				return acc;
			}, {});

		// Devolver las cuentas de moneda filtradas
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

	function transformData3(datos_TLR, datos1) {
		// Filtrar los países que están en ambas listas de datos
		const commonCountries = datos_TLR.filter((car) => {
			return datos1.some((stream) => stream.geo === car.geo);
		});

		// Obtener los países comunes y sus datos combinados
		const combinedData = commonCountries.map((country) => {
			const carSold = datos_TLR.find((car) => car.geo === country.geo);
			const streamingServices = datos1.find((stream) => stream.geo === country.geo);
			return {
				country: country.geo,
				carsSold: carSold ? carSold.obs_value : 0,
				streamingServices: streamingServices ? streamingServices.services.length : 0
			};
		});

		return combinedData;
	}

	async function crearGrafico3(data) {
		// Inicializar el gráfico
		var chart = echarts.init(document.getElementById('graph03'));

		// Configurar opciones del gráfico
		var options = {
			title: {
				text: 'Relación vehículos vendidos vs nº servicios streaming', // Título del gráfico
				left: 'center' // Alineación del título
			},
			xAxis: {
				type: 'value',
				name: 'Coches Vendidos'
			},
			yAxis: {
				type: 'value',
				name: 'Servicios de Streaming'
			},
			series: [
				{
					type: 'scatter',
					data: data.map((item) => ({
						value: [item.carsSold, item.streamingServices, item.country], // Agregar el país como tercer valor
						emphasis: {
							focus: 'series', // Enfatizar el punto al pasar el ratón
							itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							},
							label: {
								show: true, // Mostrar etiqueta de énfasis
								formatter: function (params) {
									return (
										'{a|' +
										params.data.value[2] +
										'}\n' + // Nombre del país
										'{b|Nº de servicios de streaming: ' +
										params.data.value[1] +
										'}\n' + // Nº de servicios de streaming
										'{c|Nº de vehículos vendidos: ' +
										params.data.value[0] +
										'}'
									); // Nº de vehículos vendidos
								},
								rich: {
									a: {
										color: '#000', // Color del texto del país
										fontSize: 12, // Tamaño de fuente del texto del país
										lineHeight: 20 // Espaciado de línea del texto del país
									},
									b: {
										color: '#000', // Color del texto de servicios de streaming
										padding: [3, 5], // Relleno alrededor del texto de servicios de streaming
										fontSize: 12, // Tamaño de fuente del texto de servicios de streaming
										lineHeight: 20 // Espaciado de línea del texto de servicios de streaming
									},
									c: {
										color: '#000', // Color del texto de vehículos vendidos
										padding: [3, 5], // Relleno alrededor del texto de vehículos vendidos
										fontSize: 12, // Tamaño de fuente del texto de vehículos vendidos
										lineHeight: 20 // Espaciado de línea del texto de vehículos vendidos
									}
								},
								backgroundColor: 'rgba(255, 255, 255, 0.8)', // Color de fondo del énfasis (blanco y opaco)
								borderColor: '#000', // Color del borde del énfasis
								borderWidth: 1, // Ancho del borde del énfasis
								padding: [5, 10], // Relleno alrededor del énfasis
								position: 'top' // Posición de la etiqueta
							}
						}
					})),
					symbolSize: function (data) {
						// Ajustar el tamaño de las burbujas según el número de servicios de streaming
						return Math.sqrt(data[1]) * 10;
					},
					label: {
						show: false // No mostrar etiquetas por defecto
					},
					itemStyle: {
						color: '#5470c6' // Color de las burbujas
					}
				}
			]
		};

		// Establecer las opciones en el gráfico
		chart.setOption(options);
	}

	function transformData4(data) {
		// Inicializar un objeto para contar el número de juegos para cada género
		let genreCounts = {};

		// Iterar sobre los datos y contar el número de juegos para cada género
		data.forEach((item) => {
			const genre = item.genre;
			genreCounts[genre] = (genreCounts[genre] || 0) + 1;
		});

		// Convertir el objeto de recuento en un array de objetos con la forma { genre: ..., count: ... }
		let transformedData = Object.keys(genreCounts).map((genre) => ({
			genre: genre,
			count: genreCounts[genre]
		}));

		return transformedData;
	}

	function crearGrafico4(datos) {
		// Extraer los géneros y los recuentos para configurar las series
		let labels = datos.map((item) => item.genre);
		let values = datos.map((item) => item.count);

		// Configurar los datos del gráfico
		let data = {
			xAxis: {
				type: 'category',
				data: labels
			},
			yAxis: {
				type: 'category',
				data: labels
			},
			visualMap: {
				min: Math.min(...values),
				max: Math.max(...values),
				calculable: true,
				orient: 'horizontal',
				left: 'center',
				bottom: '15%'
			},
			series: [
				{
					name: 'Número de Juegos por Género',
					type: 'heatmap',
					data: values.map((value, index) => [index, index, value]),
					label: {
						show: true
					},
					itemStyle: {
						emphasis: {
							shadowBlur: 10,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
				}
			]
		};

		// Inicializar el gráfico
		let chart = echarts.init(document.getElementById('graph04'));

		// Dibujar el gráfico
		chart.setOption(data);
	}

	async function inicializarDatos() {
		console.log('Inicializamos datos');
		let datos_TLR = await getVehicles();
		

		let datos1 = await API_TLR_1();
		console.log('Datos obtenidos de API_TLR_1');

		let datos2 = await API_TLR_2();
		console.log('Datos obtenidos de API_TLR_2');

		let datos3 = await API_TLR_3();
		console.log('Datos obtenidos de API_TLR_3');

		let datos4 = await API_TLR_4();
		console.log('Datos obtenidos de API_TLR_4');

		datos1 = geoEspana(datos1);
		datos2 = geoEspana(datos2);
		datos3 = geoEspana(datos3);

		datos = unificarBD(datos_TLR, datos1, datos2, datos3);

		let chartData1 = transformData1(datos);

		crearGrafico1(chartData1);

		let chartData2 = transformData2(datos3);
		crearGrafico2(chartData2);

		let chartData3 = transformData3(datos_TLR, datos1);
		crearGrafico3(chartData3);

		let chartData4 = transformData4(datos4);
		crearGrafico4(chartData4);
		console.log('Finaliza inicializacion...');
	}

	onMount(async () => {
		console.log('Cargamos onMount');
		inicializarDatos();
	});
</script>

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
	<script src="https://d3js.org/d3.v7.min.js"></script>
	<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/echarts@latest/dist/echarts.min.js"></script>
</svelte:head>

<div class="container">
	<div class="graph1">
		<div id="graph01" style="width:100%; height:400px;"></div>
	</div>

	<div class="graph1">
		<div id="graph02" style="width:100%; height:400px;"></div>
	</div>

	<div class="graph1">
		<div id="graph03" style="width:100%; height:400px;"></div>
	</div>

	<div class="graph1">
		<div id="graph04" style="width:100%; height:400px;"></div>
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
