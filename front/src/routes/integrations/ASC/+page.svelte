<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let API_ASC = '/api/v2/tourisms-per-age';
	let API_ASC1 = '/proxyASC1';
	let errorMsg = '';
	let covidData = [];

	if (dev) {
		API_ASC = 'http://localhost:8080' + API_ASC;
		API_ASC1 = 'http://localhost:8080' + API_ASC1;
	}

	async function API_ASC_1() {
		try {
			let response = await fetch(API_ASC1, {
				method: 'GET'
			});

			if (response.ok) {
				let data = await response.json();
				covidData = data;
				//console.log(data);
				//console.log(covidData);
				renderChart(covidData);
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

	function renderChart(data) {
        console.log(data[0])
		let deathsByProvince = {};
		data.forEach((item) => {
			let province = item.region.province;
			let deaths = item.deaths;
			if (!deathsByProvince[province]) {
				deathsByProvince[province] = 0;
			}
			deathsByProvince[province] += deaths;
		});

		// Convertir los datos en un array de objetos con la estructura esperada por CanvasJS
		let dataPoints = Object.keys(deathsByProvince).map((province) => ({
			y: deathsByProvince[province],
			name: province
		}));
        console.log(dataPoints);

		// Configurar la gráfica con los datos filtrados por provincia
		let chart1 = new CanvasJS.Chart('chart1', {
			exportEnabled: true,
			animationEnabled: true,
			title: {
				text: 'Muertes de COVID-19 por provincia en España'
			},
			legend: {
				cursor: 'pointer',
				itemclick: explodePie
			},
			data: [
				{
					type: 'pie',
					showInLegend: true,
					toolTipContent: '{name}: <strong>{y}</strong>',
					indexLabel: '{name} - {y}',
					dataPoints: dataPoints
				}
			]
		});

		chart1.render();
	}

	onMount(async () => {
		await API_ASC_1();
	});
</script>

<svelte:head>
	<script src="https://cdn.canvasjs.com/canvasjs.min.js"></script>
</svelte:head>

<div id="chart1" style="height: 300px; width: 100%;"></div>
