<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let API_TLR = '/api/v2/vehicles-stock';
	let API_MRF = '/api/v2/gdp-growth-rates';
	let API_ASC = '/api/v2/tourisms-per-age';
	let API_ASB = '/api/v2/cars-by-motor';
	let errorMsg = '';
	let exitMsg = '';
	let datos1,
		datos2,
		datos3,
		datos4 = {};

	if (dev) {
		API_TLR = 'http://localhost:8080' + API_TLR;
		API_MRF = 'http://localhost:8080' + API_MRF;
		API_ASC = 'http://localhost:8080' + API_ASC;
		API_ASB = 'http://localhost:8080' + API_ASB;
	}

	onMount(async () => {
		await loadAllData();
		datos1 = await getVehicles();
		datos2 = await getGDP();
		datos3 = await getTourisms();
		datos4 = await getCars();
		datos4 = replaceeGeo(datos4);
		datos3 = replaceeGeo(datos3);
		//console.log('Datos ASC parseados: ' + JSON.stringify(datos3));
		//console.log('Datos ASB parseados: ' + JSON.stringify(datos4));
		//console.log('DATOS MRF Crudos: ' + JSON.stringify(datos2));
		datos2 = replaceGeo(datos2);
		//console.log('DATOS MRF: ' + JSON.stringify(datos2));
		let datos = unificarBD(datos1, datos2, datos3, datos4);
		console.log('DATOS COMUNES: ' + JSON.stringify(datos));
		datos = getEstadisticas(datos);
		//console.log('DATOS TRATADOS: ' + JSON.stringify(datos));
		getChart(datos);
	});

	//Funciones para obtener los datos en la BD
	/*
	async function getInitialData() {
		try {
			if (datos1.length === 0) {
				let response = await fetch(API_TLR + '/loadInitialData', {
					method: 'GET'
				});

				if (response.ok) {
					getVehicles();
					alert('Datos Cargados Correctamente');
				} else {
					errorMsg = 'La base de datos no está vacía';
				}
			} else {
				errorMsg = 'La base de datos no está vacía';
			}
		} catch (error) {
			errorMsg = error;
		}
	}*/

	async function getInitialData() {
		try {
			let response = await fetch(API_TLR + '/loadInitialData', {
				method: 'GET'
			});

			if (response.ok) {
				exitMsg = 'Datos Cargados Correctamente';
			} else {
				errorMsg = 'La base de datos no está vacía';
			}
		} catch (error) {
			errorMsg = error;
		}
	}

	async function getVehicles() {
		try {
			await getInitialData();
			let response = await fetch(`${API_TLR}?limit=10000`, {
				method: 'GET',
				headers: {
					'Cache-Control': 'no-cache',
					Pragma: 'no-cache'
				}
			});

			if (response.ok) {
				let data = await response.json();
				console.log('DATOS TLR: ' + JSON.stringify(data));
				return data;
			} else {
				if (response.status == 404) {
					errorMsg = 'No hay datos1 en la base de datos1';
				} else {
					errorMsg = `Error ${response.status}: ${response.statusText}`;
				}
			}
		} catch (e) {
			errorMsg = e;
		}
	}

	/*
	async function getInitialGDP() {
		try {
			if (datos2.length === 0) {
				let response = await fetch(API_MRF + '/loadInitialData', {
					method: 'GET'
				});

				if (response.ok) {
					exitoMsg = 'Datos cargados correctamente';
					errorMsg = '';
				}
			}
		} catch (e) {
			errorMsg = e;
		}
	}*/

	async function getInitialGDP() {
		try {
			let response = await fetch(API_MRF + '/loadInitialData', {
				method: 'GET'
			});

			if (response.ok) {
				exitMsg = 'Datos cargados correctamente';
				errorMsg = '';
			}
		} catch (e) {
			errorMsg = e;
		}
	}

	async function getGDP() {
		try {
			await getInitialGDP();
			console.log('Datos correctamente cargados');
			let response = await fetch(API_MRF, {
				method: 'GET'
			});
			if (response.ok) {
				let data = await response.json();
				console.log('API MRF: ' + JSON.stringify(data));
				errorMsg = '';
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

	///////
	/*
	async function loadInitialDataASC() {
		try {
			if (datos3.length === 0) {
				let response = await fetch(API_ASC + '/loadInitialData', {
					method: 'GET'
				});

				if (response.ok) {
					getTourisms();
					exitMsg = 'Datos Cargados Correctamente';
				} else {
					errorMsg = 'La base de datos no está vacía';
				}
			} else {
				errorMsg = 'La base de datos no está vacía';
			}
		} catch (error) {
			errorMsg = error;
		}
	}*/
	async function loadInitialDataASC() {
		try {
			let response = await fetch(API_ASC + '/loadInitialData', {
				method: 'GET'
			});
			if (response.ok) {
				//getTourisms();
				exitMsg = 'Datos Cargados Correctamente';
			} else {
				errorMsg = 'La base de datos no está vacía';
			}
		} catch (error) {
			errorMsg = error;
		}
	}

	async function getTourisms() {
		try {
			await loadInitialDataASC();
			let response = await fetch(`${API_ASC}?limit=10000`, {
				method: 'GET',
				headers: {
					'Cache-Control': 'no-cache',
					Pragma: 'no-cache'
				}
			});

			if (response.ok) {
				let data = await response.json();
				//console.log('DATOS ASC: ' + JSON.stringify(data));
				return data;
			} else {
				if (response.status == 404) {
					errorMsg = 'No hay datos3 en la base de datos3';
				} else {
					errorMsg = `Error ${response.status}: ${response.statusText}`;
				}
			}
		} catch (e) {
			errorMsg = e;
		}
	}
	///////
	/*
	async function loadInitialCars() {
		try {
			if (datos4.length === 0) {
				let response = await fetch(API_ASB + '/loadInitialData', {
					method: 'GET'
				});

				if (response.ok) {
					getCars();
					alert('Datos Cargados Correctamente');
				} else {
					errorMsg = 'La base de datos no está vacía';
				}
			} else {
				errorMsg = 'La base de datos no está vacía';
			}
		} catch (error) {
			errorMsg = error;
		}
	}*/

	async function loadInitialCars() {
		try {
			let response = await fetch(API_ASB + '/loadInitialData', {
				method: 'GET'
			});

			if (response.ok) {
				exitMsg = 'Datos cartados correctamente';
			} else {
				errorMsg = 'La base de datos no está vacía';
			}
		} catch (error) {
			errorMsg = error;
		}
	}

	async function getCars() {
		try {
			await loadInitialCars();
			let response = await fetch(`${API_ASB}?limit=10000`, {
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
					errorMsg = 'No hay datos4 en la base de datos3';
				} else {
					errorMsg = `Error ${response.status}: ${response.statusText}`;
				}
			}
		} catch (e) {
			errorMsg = e;
		}
	}

	//Cargar todos los datos
	async function loadAllData() {
		try {
			await getInitialData();
			await getInitialGDP();
			await loadInitialCars();
			await loadInitialDataASC();
		} catch (error) {
			errorMsg = error;
		}
	}

	function replaceGeo(data2) {
		const countryNames = {
			albania: 'Albania',
			austria: 'Austria',
			belgium: 'Bélgica',
			bulgary: 'Bulgaria',
			croatia: 'Croacia',
			cyprus: 'Chipre',
			czech_republic: 'República Checa',
			denmark: 'Dinamarca',
			estonia: 'Estonia',
			finland: 'Finlandia',
			france: 'Francia',
			germany: 'Alemania',
			greece: 'Grecia',
			hungary: 'Hungría',
			ireland: 'Irlanda',
			iceland: 'Islandia',
			italy: 'Italia',
			latvia: 'Letonia',
			lithuania: 'Lituania',
			luxembourg: 'Luxemburgo',
			malta: 'Malta',
			netherlands: 'Países Bajos',
			poland: 'Polonia',
			portugal: 'Portugal',
			romania: 'Rumania',
			slovakia: 'Eslovaquia',
			slovenia: 'Eslovenia',
			spain: 'España',
			sweden: 'Suecia',
			united_kingdom: 'Reino Unido'
		};

		return data2.map((item) => {
			return {
				...item,
				geo: countryNames[item.geo] || item.geo // Si el país no está en la lista, deja el valor original
			};
		});
	}

	function replaceeGeo(data3) {
		const countryNames = {
			DE: 'Alemania',
			EE: 'Estonia',
			IE: 'Irlanda',
			EL: 'Grecia',
			ES: 'España',
			BG: 'Bulgaria',
			CZ: 'República Checa',
			FR: 'Francia',
			HR: 'Croacia',
			IT: 'Italia',
			CY: 'Chipre',
			LV: 'Letonia',
			LT: 'Lituania',
			LU: 'Luxemburgo',
			HU: 'Hungría',
			MT: 'Malta',
			NL: 'Países Bajos',
			AT: 'Austria',
			PL: 'Polonia',
			PT: 'Portugal',
			RO: 'Rumania',
			SI: 'Eslovenia',
			SK: 'Eslovaquia',
			FI: 'Finlandia',
			SE: 'Suecia',
			IS: 'Islandia',
			LI: 'Liechtenstein',
			NO: 'Noruega',
			CH: 'Suiza',
			UK: 'Reino Unido',
			BA: 'Bosnia y Herzegovina',
			ME: 'Montenegro',
			MD: 'Moldavia',
			MK: 'Macedonia del Norte',
			AL: 'Albania',
			RS: 'Serbia',
			TR: 'Turquía',
			XK: 'Kosovo',
			GE: 'Georgia'
		};

		return data3.map((item) => {
			return {
				...item,
				geo: countryNames[item.geo] || item.geo // Si el país no está en la lista, deja el valor original
			};
		});
	}

	//Creamos función que unifique datos
	function unificarBD(data1, data2, data3, data4) {
		// Crear conjuntos de países únicos para cada conjunto de datos
		const geoSet1 = new Set(data1.map((item) => item.geo));
		const geoSet2 = new Set(data2.map((item) => item.geo));
		const geoSet3 = new Set(data3.map((item) => item.geo));
		const geoSet4 = new Set(data4.map((item) => item.geo));

		// Encontrar la intersección de países comunes a todas las bases de datos
		const commonGeoSet = new Set(
			[...geoSet1].filter((geo) => geoSet2.has(geo) && geoSet3.has(geo) && geoSet4.has(geo))
		);

		// Filtrar datos para incluir solo países comunes
		const filteredData1 = data1.filter((item) => commonGeoSet.has(item.geo));
		const filteredData2 = data2.filter((item) => commonGeoSet.has(item.geo));
		const filteredData3 = data3.filter((item) => commonGeoSet.has(item.geo));
		const filteredData4 = data4.filter((item) => commonGeoSet.has(item.geo));

		// Combinar todos los datos filtrados
		const combinedData = [...filteredData1, ...filteredData2, ...filteredData3, ...filteredData4];

		return combinedData;
	}

	// Función para crear la estadística
	// Función para crear la estadística
	function getEstadisticas(datos) {
		const countryData = datos.reduce((acc, curr) => {
			if (!acc[curr.geo]) {
				acc[curr.geo] = { pib: 0, deathsInFlights: 0, volgdp: 0, road_deaths_per_million_inhabitants:0}; // Incluir el volgdp
			}
			// Acumulación de PIB si tiene el atributo "frequency"
			if ('frequency' in curr) {
				acc[curr.geo].pib += curr.obs_value;
			}
			// Acumulación de muertes en vuelos si existe flights_passangers
			if (curr.flights_passangers) {
				acc[curr.geo].deathsInFlights += curr.flights_passangers;
			}
			// Volgdp
			if (curr.volgdp) {
				acc[curr.geo].volgdp = curr.volgdp;
			}
			// road_deaths_per_million_inhabitants
			if (curr.road_deaths_per_million_inhabitants) {
				acc[curr.geo].road_deaths_per_million_inhabitants += curr.road_deaths_per_million_inhabitants;
			}
			return acc;
		}, {});

		const sortedData = Object.entries(countryData).map(
			([country, { pib, deathsInFlights, volgdp ,road_deaths_per_million_inhabitants}]) => ({
				country: country,
				pib: pib,
				deathsInFlights: deathsInFlights,
				volgdp: volgdp, // Incluir el volgdp
				road_deaths_per_million_inhabitants: road_deaths_per_million_inhabitants
			})
		);

		const chartData = {
			categories: sortedData.map((item) => item.country),
			series: [
				{
					name: 'PIB Acumulado',
					data: sortedData.map((item) => item.pib)
				},
				{
					name: 'Muertes en Aviones',
					data: sortedData.map((item) => item.deathsInFlights)
				},
				{
					name: 'VolGDP',
					data: sortedData.map((item) => item.volgdp) // Nueva serie para VolGDP
				},
				{
					name: 'Muertes en carretera por millón de habitantes',
					data: sortedData.map((item) => item.road_deaths_per_million_inhabitants)
				}
			]
		};

		return chartData;
	}

	// Creamos el gráfico
	function getChart(datos) {
		Highcharts.chart('graph', {
			chart: {
				type: 'area'
			},
			title: {
				text: 'PIB Acumulado vs Muertes en Aviones vs VolGDP por País vs Muertes en carretera pmh' // Actualizar título
			},
			xAxis: {
				categories: datos.categories,
				crosshair: true
			},
			yAxis: [
				{
					min: 0,
					title: {
						text: 'PIB Acumulado'
					}
				},
				{
					min: 0,
					title: {
						text: 'Muertes en Aviones'
					},
					opposite: true
				},
				{
					min: 0,
					title: {
						text: 'VolGDP'
					},
					opposite: true
				},
				{
					min: 0,
					title: {
						text: 'Muertes en carretera pmh'
					}
				}
			],
			tooltip: {
				shared: true
			},
			series: [
				{
					name: 'PIB Acumulado',
					data: datos.series[0].data,
					tooltip: {
						valueSuffix: ' unidades'
					}
				},
				{
					name: 'Muertes en Aviones',
					data: datos.series[1].data,
					yAxis: 1,
					tooltip: {
						valueSuffix: ' personas'
					}
				},
				{
					name: 'VolGDP',
					data: datos.series[2].data, // Nueva serie para VolGDP
					yAxis: 2, // Usar el tercer eje y para VolGDP
					tooltip: {
						valueSuffix: ' unidades'
					}
				},
				{
					name: 'Muertes en carretera pmh',
					data: datos.series[3].data, 
					yAxis: 3, 
					tooltip: {
						valueSuffix: ' fallecidos'
					}
				}
			]
		});
	}
</script>

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/highcharts-more.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<div class="container">
	<div class="graph1">
		<div id="graph" style="width:100%; height:400px;"></div>
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
</style>
