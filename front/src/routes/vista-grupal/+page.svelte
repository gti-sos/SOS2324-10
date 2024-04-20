<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let API_TLR = '/api/v2/vehicles-stock';
	let API_MRF = '/api/v2/gdp-growth-rates';
	let API_ASC = '/api/v2/tourisms-per-age';
	let errorMsg = '';

	if (dev) {
		API_TLR = 'http://localhost:8080' + API_TLR;
		API_MRF = 'http://localhost:8080' + API_MRF;
		API_ASC = 'http://localhost:8080' + API_ASC;
	}

	onMount(async () => {
		let datos1 = await getVehicles();
		let datos2 = await getGDP();
		let datos3 = await getTourisms();
		console.log('DATOS MRF Crudos: ' + JSON.stringify(datos2));
		datos2 = replaceGeo(datos2);
		console.log('DATOS MRF: ' + JSON.stringify(datos2));
		let datos = unificarBD(datos1, datos2);
		console.log('DATOS COMUNES: ' + JSON.stringify(datos));
		datos = getEstadisticas(datos);
		console.log('DATOS TRATADOS: ' + JSON.stringify(datos));
		getChart(datos);
	});

	//Funciones para obtener los datos en la BD
	async function getInitialData() {
		try {
			if (datos.length === 0) {
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

	async function getInitialGDP() {
		try {
			if (gdp.length === 0) {
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
	}

	async function getGDP() {
		await getInitialGDP();
		try {
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
			DE: 'Germany',
			EE: 'Estonia',
			IE: 'Ireland',
			EL: 'Greece',
			ES: 'Spain',
			FR: 'France',
			HR: 'Croatia',
			IT: 'Italy',
			CY: 'Cyprus',
			LV: 'Latvia',
			LT: 'Lithuania',
			LU: 'Luxembourg',
			HU: 'Hungary',
			MT: 'Malta',
			NL: 'Netherlands',
			AT: 'Austria',
			PL: 'Poland',
			PT: 'Portugal',
			RO: 'Romania',
			SI: 'Slovenia',
			SK: 'Slovakia',
			FI: 'Finland',
			SE: 'Sweden',
			IS: 'Iceland',
			LI: 'Liechtenstein',
			NO: 'Norway',
			CH: 'Switzerland',
			UK: 'United Kingdom',
			BA: 'Bosnia and Herzegovina',
			ME: 'Montenegro',
			MD: 'Moldova',
			MK: 'North Macedonia',
			AL: 'Albania',
			RS: 'Serbia',
			TR: 'Türkiye',
			XK: 'Kosovo*',
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
	function unificarBD(data1, data2) {
		const geoSet1 = new Set(data1.map((item) => item.geo));
		const filteredData2 = data2.filter((item) => geoSet1.has(item.geo));
		const geoSet2 = new Set(filteredData2.map((item) => item.geo));

		const filteredData1 = data1.filter((item) => geoSet2.has(item.geo));

		const combinedData = [...filteredData1, ...filteredData2];

		return combinedData;
	}

	//Función para crear la estadística
	function getEstadisticas(datos) {
		const countryData = datos.reduce((acc, curr) => {
			if (!acc[curr.geo]) {
				acc[curr.geo] = { pib: 0, deathsInFlights: 0 };
			}
			// Acumulación de PIB si tiene el atributo "frequency"
			if ('frequency' in curr) {
				acc[curr.geo].pib += curr.obs_value;
			}
			// Acumulación de muertes en vuelos si existe flights_passangers
			if (curr.flights_passangers) {
				acc[curr.geo].deathsInFlights += curr.flights_passangers;
			}
			return acc;
		}, {});

		const sortedData = Object.entries(countryData).map(([country, { pib, deathsInFlights }]) => ({
			country: country,
			pib: pib,
			deathsInFlights: deathsInFlights
		}));

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
				}
			]
		};

		return chartData;
	}

	//Creamos el gráfico
	function getChart(datos) {
		Highcharts.chart('graph', {
			chart: {
				type: 'area'
			},
			title: {
				text: 'PIB Acumulado vs Muertes en Aviones por País'
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
				}
			],
			tooltip: {
				shared: true
			},
			series: [
				{
					name: 'PIB Acumulado',
					data: datos.series[0].data, // Accede a los datos directamente
					tooltip: {
						valueSuffix: ' unidades'
					}
				},
				{
					name: 'Muertes en Aviones',
					data: datos.series[1].data, // Accede a los datos directamente
					yAxis: 1,
					tooltip: {
						valueSuffix: ' personas'
					}
				}
			]
		});
	}

	///////
	async function loadInitialData() {
		try {
			if (datos.length === 0) {
				let response = await fetch(API_ASC + '/loadInitialData', {
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
	}

	async function getTourisms() {
		try {
			await loadInitialData();
			let response = await fetch(`${API_ASC}?limit=10000`, {
				method: 'GET',
				headers: {
					'Cache-Control': 'no-cache',
					Pragma: 'no-cache'
				}
			});

			if (response.ok) {
				let data = await response.json();
				console.log('DATOS ASC: ' + JSON.stringify(data));
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
</script>

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
