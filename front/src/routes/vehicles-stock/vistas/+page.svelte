<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
	<script src="https://d3js.org/d3.v7.min.js"></script>
</svelte:head>
<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	//import * as d3 from 'd3';
	

	let API_TLR = '/api/v2/vehicles-stock';
	let errorMsg = '';


	if (dev) {
		API_TLR = 'http://localhost:8080' + API_TLR;
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


	async function getChart() {
		let datos = await getVehicles();
		const chartData = transformData(datos);
		const chart = Highcharts.chart('graph', {
			chart: {
				type: 'bar'
			},
			title: {
				text: 'Ventas de vehículos por país'
			},
			xAxis: {
				categories: chartData.categories,
				title: {
					text: 'Países'
				}
			},
			yAxis: {
				title: {
					text: 'Número de vehículos vendidos'
				}
			},
			plotOptions: {
				series: {
					color: '#3E92CC',
					cursor: 'pointer',
					events: {
						click: function (event) {
							getChart2(event.point.category);
						}
					}
				}
			},
			series: [
				{
					name: 'Total de vehículos vendidos',
					data: chartData.series
				}
			]
		});
		//getChart2('España');
	}


	function transformData(datos) {
		const countrySales = datos.reduce((acc, curr) => {
			if (!acc[curr.geo]) {
				acc[curr.geo] = 0;
			}
			acc[curr.geo] += curr.obs_value;
			return acc;
		}, {});


		const sortedData = Object.entries(countrySales).map(([country, totalSales]) => ({
			country,
			totalSales
		}));


		sortedData.sort((a, b) => b.totalSales - a.totalSales);


		const chartData = {
			categories: sortedData.map((item) => item.country),
			series: sortedData.map((item) => item.totalSales)
		};


		return chartData;
	}


	//Gráficos d3js
	async function getChart2(country) {
    d3.select('#graphD3').selectAll('*').remove();


    const chartData = transformData2(datos, country);


    const margin = { top: 20, right: 30, bottom: 30, left: 70 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;


    const svg = d3
        .select("#graphD3")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


    const x = d3.scaleBand()
        .domain(chartData.categories)
        .range([0, width])
        .padding(0.1);


    const y = d3.scaleLinear()
        .domain([0, d3.max(chartData.series.flatMap(serie => serie.data))])
        .nice()
        .range([height, 0]);


    const color = d3.scaleOrdinal()
        .domain(chartData.series.map(serie => serie.name))
        .range(d3.schemeCategory10);


    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));


    svg.append("g")
        .call(d3.axisLeft(y));


    const barGroups = svg.selectAll(".barGroup")
        .data(chartData.categories)
        .enter()
        .append("g")
        .attr("class", "barGroup")
        .attr("transform", d => `translate(${x(d)},0)`);


    barGroups.selectAll("rect")
        .data((d, i) => chartData.series.map(serie => ({ serie: serie.name, value: serie.data[i] })))
        .enter()
        .append("rect")
        .attr("x", d => x.bandwidth() / 3 * chartData.series.findIndex(serie => serie.name === d.serie))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth() / 3)
        .attr("height", d => height - y(d.value))
        .attr("fill", d => color(d.serie));


    const legend = svg.selectAll(".legend")
        .data(chartData.series)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(${width -120},${i * 20})`);


    legend.append("rect")
        .attr("x", 0)
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", d => color(d.name));


    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(d => d.name);


    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom / 1.5)
        .style("text-anchor", "middle")
        .text("Años");


    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Cantidad");


    svg.append("text")
        .attr("x", width / 2)
        .attr("y", margin.top / 2)
        .style("text-anchor", "middle")
        .text(`Gráfico de ${country}`);
}






	//Función para obtener grafo completo dado un país
	function transformData2(datos, country) {
		const countryFilter = datos.filter((item) => item.geo === country);


		const transformedData = countryFilter.reduce((acc, curr) => {
			const { year, obs_value, flights_passangers, cars_deaths } = curr;
			if (!acc[year]) {
				acc[year] = {
					obs_value: 0,
					flights_passangers: 0,
					cars_deaths: 0
				};
			}
			acc[year].obs_value += obs_value || 0;
			acc[year].flights_passangers += flights_passangers || 0;
			acc[year].cars_deaths += cars_deaths || 0;
			return acc;
		}, {});


		const sortedYears = Object.keys(transformedData).sort((a, b) => a - b);


		const countryData = {
			categories: sortedYears,
			series: [
				{
					name: 'Obs Value',
					data: sortedYears.map((year) => transformedData[year].obs_value)
				},
				{
					name: 'Flights Passangers',
					data: sortedYears.map((year) => transformedData[year].flights_passangers)
				},
				{
					name: 'Cars Deaths',
					data: sortedYears.map((year) => transformedData[year].cars_deaths)
				}
			]
		};


		return countryData;
	}


	let datos;


	onMount(async () => {
		datos = await getVehicles();
		getChart();
		getChart2('España');
	});
</script>


<div class="container">
	<div class="graph1">
		<div id="graph" style="width:100%; height:400px;"></div>
	</div>


	<div class="message">
		<span>! </span> Pinche en un país para mostrar más información
	</div>


	<div class="graph1">
		<div id="graphD3" style="width:100%; height:400px;"></div>
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


	.graph1{
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





