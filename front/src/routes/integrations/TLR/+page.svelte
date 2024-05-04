<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import * as d3 from 'd3';

	let API_TLR1 = '/proxyTLR1';
	let errorMsg = '';
	let datos= {};
	if (dev) {
		API_TLR1 = 'http://localhost:8080' + API_TLR1;
	}

	async function API_cars_TLR() {

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

	onMount(async () => {
		datos = await API_cars_TLR();
		console.log(datos);
	});
</script>

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
	<script src="https://d3js.org/d3.v7.min.js"></script>
</svelte:head>
