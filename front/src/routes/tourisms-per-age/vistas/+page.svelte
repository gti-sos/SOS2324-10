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

	let API_TLR = '/api/v2/tourisms-per-age';
	let errMsg = '';

	if (dev) {
		API_TLR = 'http://localhost:8080' + API_ASC;
	}

	async function getTourisms() {
		try {
			let response = await fetch(`${API_ASC}?limit=10000`, {
				method: 'GET',
			});

			if (response.ok) {
				let data = await response.json();
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

    async function graf1(data) {
        // Set up the chart
		const chart = new Highcharts.Chart({
			chart: {
				renderTo: 'container',
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
				categories: [
					'ES',
					'BG',
					'CZ',
					'LT',
					'PL',
					'IT',
					'SE',
					'HU',
					'DE'
				]
			},
			yAxis: {
				title: {
					enabled: false
				}
			},
			tooltip: {
				headerFormat: '<b>{point.key}</b><br>',
				pointFormat: 'Turismos vendidos: {point.y}'
			},
			title: {
				text: 'Turismos nuevos vendidos en 2017',
				align: 'left'
			},
			subtitle: {
				text:
					'Source: ' +
					'<a href="https://ofv.no/registreringsstatistikk"' +
					'target="_blank">Eurostat</a>',
				align: 'left'
			},
			legend: {
				enabled: false
			},
			accessibility: {
				enabled: false // Disable accessibility features
			},
			plotOptions: {
				column: {
					depth: 25
				}
			},
			series: [
				{
					data: data,
					colorByPoint: true
				}
			]
		});

		function showValues() {
			document.getElementById('alpha-value').innerHTML = chart.options.chart.options3d.alpha;
			document.getElementById('beta-value').innerHTML = chart.options.chart.options3d.beta;
			document.getElementById('depth-value').innerHTML = chart.options.chart.options3d.depth;
		}

		// Activate the sliders
		document.querySelectorAll('#sliders input').forEach((input) =>
			input.addEventListener('input', (e) => {
				chart.options.chart.options3d[e.target.id] = parseFloat(e.target.value);
				showValues();
				chart.redraw(false);
			})
		);

		showValues();
    }
	onMount(async () => {
		data = await getTourisms();
	});
</script>



<div id="container" style="width:100%; height:400px;"></div>
