<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let API_ASB = '/api/v2/cars_by_motor';
	let API_ASB1 = '/proxyASB1';

	let errorMsg = '';
	let datos = {};

	if (dev) {
		API_ASB = 'http://localhost:8080' + API_ASB;
		API_ASB1 = 'http://localhost:8080' + API_ASB1;
	}

	async function API_ASB_1() {
		try {
			const url =
				'https://algobook-stock-api.p.rapidapi.com/api/v1/stocks?tickers=AMZN,AAPL,MSFT,GOOGL,KO,MCD';
			const options = {
				method: 'GET',
				headers: {
					'X-RapidAPI-Key': '1ae5868997msh0a3205e591a7ed8p195ba3jsn5cbea63c1c53',
					'X-RapidAPI-Host': 'algobook-stock-api.p.rapidapi.com'
				}
			};

			const response = await fetch(url, options);
			if (response.ok) {
				let data = await response.json();
				datos = data;
				console.log(datos);
				getGrafica1(datos);
				return datos;
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

	async function getGrafica1(data) {
		try {
			const parsedData = parseData1(data); // Parsear los datos del backend
			createDynamicChart1(parsedData); // Crear el gráfico dinámico con los datos parseados
		} catch (error) {
			console.error('Error al procesar los datos:', error);
		}
	}

	function parseData1(data) {
		// Convertir los datos en el formato requerido para el gráfico
		const parsedData = data.map((item) => ({
			name: item.companyName,
			y: item.open
		}));

		return parsedData;
	}

	function createDynamicChart1(data) {
		var chart = JSC.chart('container1', {
			debug: true,
			defaultSeries_type: 'column',
			legend_visible: false,
			defaultPoint_label_visible: true,
			yAxis_visible: false,
			xAxis_defaultTick: {
				placement: 'outside',
				label_style: {
					color: '#000',
					fontWeight: 'bold'
				}
			},
			title_label_text: 'Opening Prices by Company', // Establecer el título del gráfico
			title_label_style_fontSize: '20px', // Tamaño de la fuente del título
			title_label_style_fontWeight: 'bold', // Peso de la fuente del título
			series: [
				{
					name: 'Company',
					palette: 'default',
					points: data
				}
			]
		});
	}

	async function handleSubmit(event) {
		event.preventDefault();

		const form = event.target;
		const formData = new FormData(form);

		const sex = formData.get('sex');
		const age = formData.get('age');
		const cm = formData.get('cm');
		const kilos = formData.get('kilos');
		const url = `https://nutrition-calculator.p.rapidapi.com/api/nutrition-info?measurement_units=met&sex=${sex}&age_value=${age}&age_type=yrs&cm=${cm}&kilos=${kilos}`;
		const options = {
			method: 'GET',
			headers: {
				'X-RapidAPI-Key': '1ae5868997msh0a3205e591a7ed8p195ba3jsn5cbea63c1c53',
				'X-RapidAPI-Host': 'nutrition-calculator.p.rapidapi.com'
			}
		};

		try {
			const response = await fetch(url, options);
			if (response.ok) {
				const result = await response.json();
				console.log(result);
				// Aquí podrías procesar la respuesta de la API según tus necesidades
				getGrafica2(result); // Llamar a la función getGrafica2 después de obtener los datos
			} else {
				console.error('Error en la solicitud:', response.statusText);
			}
		} catch (error) {
			console.error('Error al realizar la solicitud:', error);
		}
	}

	async function getGrafica2(data) {
		try {
			const parsedData = parseData2(data); // Parsear los datos del backend
			createDynamicChart2(parsedData); // Crear el gráfico dinámico con los datos parseados
		} catch (error) {
			console.error('Error al procesar los datos:', error);
		}
	}

	function parseData2(data) {
		// Extraer los datos relevantes de macronutrientes
		const macronutrientsData = data.macronutrients_table['macronutrients-table'];

		// Filtrar y parsear los datos de los macronutrientes que vamos a utilizar en la gráfica
		const relevantData = macronutrientsData
			.filter((nutrient) => {
				const nutrientName = nutrient[0];
				return (
					nutrientName === 'Carbohydrate' ||
					nutrientName === 'Total Fiber' ||
					nutrientName === 'Protein' ||
					nutrientName === 'Fat'
				);
			})
			.map((nutrient) => ({
				name: nutrient[0],
				value: parseNutrientValue(nutrient[1])
			}));

		return relevantData;
	}

	// Función para parsear el valor del nutriente
	function parseNutrientValue(valueString) {
		// Si el valor contiene un rango, se toma el valor medio
		if (valueString.includes('-')) {
			const [min, max] = valueString.split('-').map((val) => parseFloat(val.trim()));
			return (min + max) / 2;
		} else {
			// Si es un solo valor, se devuelve tal cual
			return parseFloat(valueString);
		}
	}

	function createDynamicChart2(data) {
		var chart = JSC.Chart('container2', {
			debug: true,
			title_position: 'center',
			legend: {
				template: '%value {%percentOfTotal:n1}% %icon %name',
				position: 'inside left bottom'
			},
			defaultSeries: {
				type: 'pie',
				pointSelection: true
			},
			defaultPoint_label_text: '<b>%name</b>',
			title_label_text: 'Nutritional Information',
			series: [
				{
					name: 'Nutrients',
					points: data.map((nutrient) => ({
						name: nutrient.name,
						y: nutrient.value
					}))
				}
			]
		});
	}

	async function API_ASB_3() {
		try {
			const url = 'https://mineable-coins.p.rapidapi.com/coins';
			const options = {
				method: 'GET',
				headers: {
					'X-RapidAPI-Key': '1ae5868997msh0a3205e591a7ed8p195ba3jsn5cbea63c1c53',
					'X-RapidAPI-Host': 'mineable-coins.p.rapidapi.com'
				}
			};

			const response = await fetch(url, options);
			if (response.ok) {
				let data = await response.json();
				datos = data;
				console.log(datos);
				getGrafica3(datos);
				return datos;
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

	async function getGrafica3(data) {
		try {
			const parsedData = parseData3(data); // Parsear los datos del backend
			createDynamicChart3(parsedData); // Crear el gráfico dinámico con los datos parseados
		} catch (error) {
			console.error('Error al procesar los datos:', error);
		}
	}

	function parseData3(data) {
		// Filtrar las monedas con datos válidos
		const validCoins = data.filter(
			(item) =>
				typeof item.name === 'string' &&
				typeof item.volume === 'number' &&
				!isNaN(item.volume) &&
				typeof item.reward_block === 'number' &&
				!isNaN(item.reward_block) &&
				typeof item.difficulty === 'number' &&
				!isNaN(item.difficulty)
		);

		// Ordenar los datos por volumen en orden descendente
		const sortedCoins = validCoins.sort((a, b) => b.volume - a.volume);

		// Tomar los primeros 5 elementos con el mayor volumen
		const topFiveCoins = sortedCoins.slice(0, 5);

		// Crear un array con los valores de volumen, reward_block y difficulty de las monedas seleccionadas
		const parsedData = topFiveCoins.map((item) => {
			return {
				name: item.name,
				volume: item.volume,
				reward_block: item.reward_block,
				difficulty: item.difficulty
			};
		});

		return parsedData;
	}

	function createDynamicChart3(data) {
		var chart = JSC.Chart('container3', {
			debug: true,
			title_label_text: 'Top Five Cryptos by Volume',
			yAxis: {
				label_text: 'Cryptocurrency'
			},
			xAxis: {
				label_text: 'Value'
			},
			series: [
				{
					type: 'horizontal column',
					points: data.map((coin) => ({
						name: coin.name,
						y: coin.volume,
						x: coin.price
					}))
				}
			]
		});
	}

	onMount(async () => {
		await API_ASB_1();
		await API_ASB_3();
	});
</script>

<svelte:head>
	<script src="https://code.jscharting.com/latest/jscharting.js"></script>
	<script src="https://code.jscharting.com/latest/modules/types.js"></script>
</svelte:head>

<form
	on:submit={handleSubmit}
	style="margin-top: 20px; padding: 20px; background-color: #f5f5f5; border-radius: 8px;"
>
	<label style="display: block; margin-bottom: 10px;">
		Sex:
		<select name="sex" style="margin-left: 10px;">
			<option value="male">Male</option>
			<option value="female" selected>Female</option>
		</select>
	</label>
	<label style="display: block; margin-bottom: 10px;">
		Age:
		<input type="number" name="age" value="20" required style="margin-left: 10px;" />
	</label>
	<label style="display: block; margin-bottom: 10px;">
		Height (cm):
		<input type="number" name="cm" value="170" required style="margin-left: 10px;" />
	</label>
	<label style="display: block; margin-bottom: 10px;">
		Weight (kg):
		<input type="number" name="kilos" value="70" required style="margin-left: 10px;" />
	</label>
	<button
		type="submit"
		style="background-color: #007bff; color: #fff; border: none; border-radius: 4px; padding: 10px 20px; cursor: pointer;"
		>Calculate</button
	>
</form>

<div id="container2" style="width:100%; height:400px;"></div>
<div id="container1" style="width:100%; height:400px;"></div>
<div id="container3" style="width:100%; height:400px;"></div>
<div id="container4" style="width:100%; height:400px;"></div>

<style>
	#container1 {
		max-width: 600px;
		margin: 1em auto;
	}
	form {
		margin-top: 20px;
	}
	#container2 {
		max-width: 600px;
		margin: 1em auto;
	}
	#container3 {
		max-width: 600px;
		margin: 1em auto;
	}
	#container4 {
		max-width: 600px;
		margin: 1em auto;
	}
</style>
