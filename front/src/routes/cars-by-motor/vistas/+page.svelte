<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let API_ASB = '/api/v2/cars-by-motor';
	let errMsg = '';

	if (dev) {
		API_ASB = 'http://localhost:8080' + API_ASB;
	}

	async function getCars() {
		try {
			let response = await fetch(`${API_ASB}?limit=10000`, {
				method: 'GET'
			});

			if (response.ok) {
				let data = await response.json();
				getGrafica1(data);
				getGrafica2(data);
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
	async function getGrafica1(data) {
		try {
			const parsedData = parseData(data); // Parsear los datos del backend
			createDynamicChart(parsedData); // Crear el gráfico dinámico con los datos parseados
		} catch (error) {
			console.error('Error al procesar los datos:', error);
		}
	}

	function parseData(data) {
		// Crear un objeto para almacenar los valores acumulados por motor_nrg
		const motorData = {};

		// Iterar sobre los datos y acumular los valores por motor_nrg
		data.forEach((item) => {
			const motorName = item.motor_nrg; // Nombre del motor_nrg
			const obsValue = item.obs_value; // Valor asociado (obs_value)

			// Si el motor_nrg ya existe en el objeto, acumular el valor
			if (motorData.hasOwnProperty(motorName)) {
				motorData[motorName] += obsValue;
			} else {
				// Si el motor_nrg no existe en el objeto, inicializarlo con el valor
				motorData[motorName] = obsValue;
			}
		});

		// Convertir el objeto acumulado en un array de objetos para Highcharts
		const parsedData = Object.keys(motorData).map((motorName) => {
			return {
				name: motorName,
				y: motorData[motorName]
			};
		});

		return parsedData;
	}

	function createDynamicChart(data) {
		// Aquí creas el gráfico dinámico utilizando Highcharts.chart y los datos parseados.
		Highcharts.chart('container', {
			chart: {
				type: 'pie'
			},
			title: {
				text: 'Coches por energía del motor',
				align: 'center'
			},
			tooltip: {
				pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			},
			accessibility: {
				point: {
					valueSuffix: '%'
				}
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					borderWidth: 2,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b><br>{point.percentage}%',
						distance: 20
					}
				}
			},
			series: [
				{
					// Disable mouse tracking on load, enable after custom animation
					enableMouseTracking: false,
					animation: {
						duration: 2000
					},
					colorByPoint: true,
					data: data // Aquí pasas los datos parseados
				}
			]
		});
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
    // Crear un objeto para almacenar los valores de road_deaths_per_million_inhabitants por país
    const countryData = {};

    // Iterar sobre los datos y acumular los valores por país
    data.forEach((item) => {
        const countryName = item.geo; // Nombre del país
        const roadDeaths = item.road_deaths_per_million_inhabitants; // Valor de road_deaths_per_million_inhabitants

        // Si el país ya existe en el objeto, acumular el valor de roadDeaths
        if (countryData.hasOwnProperty(countryName)) {
            countryData[countryName] += roadDeaths;
        } else {
            // Si el país no existe en el objeto, inicializarlo con el valor de roadDeaths
            countryData[countryName] = roadDeaths;
        }
    });

    // Convertir el objeto acumulado en un array de objetos para Highcharts
    const parsedData = Object.keys(countryData).map((countryName) => {
        return {
            name: countryName,
            y: countryData[countryName]
        };
    });

    return parsedData;
}


	function createDynamicChart2(data) {
		// Aquí creas el gráfico dinámico utilizando Highcharts.chart y los datos parseados.
		Highcharts.chart('container2', {
			chart: {
				type: 'cylinder',
				options3d: {
					enabled: true,
					alpha: 15,
					beta: 15,
					depth: 50,
					viewDistance: 25
				}
			},
			title: {
				text: 'Road Deaths per Million Inhabitants by Country'
			},
			xAxis: {
				categories: data.map((item) => item.name), // Países en el eje X
				title: {
					text: 'Countries'
				},
				labels: {
					skew3d: true
				}
			},
			yAxis: {
				title: {
					margin: 20,
					text: 'Road Deaths per Million Inhabitants'
				},
				labels: {
					skew3d: true
				}
			},
			tooltip: {
				headerFormat: '<b>Country: {point.x}</b><br>',
				pointFormat: 'Road Deaths per Million Inhabitants: <b>{point.y}</b>'
			},
			plotOptions: {
				series: {
					depth: 25,
					colorByPoint: true
				}
			},
			series: [
				{
					data: data, // Datos parseados con nombres de países y valores de muertes en carretera
					name: 'Road Deaths per Million Inhabitants',
					showInLegend: false
				}
			]
		});
	}

	// async function getGrafica1() {
	// 	const chart = // Create the chart
	// 		Highcharts.chart('container', {
	// 			chart: {
	// 				type: 'pie'
	// 			},
	// 			title: {
	// 				text: 'Cars by motor enrgy',
	// 				align: 'center'
	// 			},

	// 			accessibility: {
	// 				announceNewData: {
	// 					enabled: true
	// 				},
	// 				point: {
	// 					valueSuffix: '%'
	// 				}
	// 			},

	// 			plotOptions: {
	// 				series: {
	// 					borderRadius: 5,
	// 					dataLabels: [
	// 						{
	// 							enabled: true,
	// 							distance: 15,
	// 							format: '{point.name}'
	// 						},
	// 						{
	// 							enabled: true,
	// 							distance: '-30%',
	// 							filter: {
	// 								property: 'percentage',
	// 								operator: '>',
	// 								value: 5
	// 							},
	// 							format: '{point.y:.1f}%',
	// 							style: {
	// 								fontSize: '0.9em',
	// 								textOutline: 'none'
	// 							}
	// 						}
	// 					]
	// 				}
	// 			},

	// 			tooltip: {
	// 				headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
	// 				pointFormat:
	// 					'<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
	// 			},

	// 			series: [
	// 				{
	// 					name: 'Motor Energies',
	// 					colorByPoint: true,
	// 					data: [
	// 						{
	// 							name: 'GAS',
	// 							y: (2190805 / 4568994) * 100,
	// 							drilldown: 'GAS'
	// 						},
	// 						{
	// 							name: 'DIE',
	// 							y: (161095 / 4568994) * 100,
	// 							drilldown: 'DIE'
	// 						},
	// 						{
	// 							name: 'ALT',
	// 							y: (1509492 / 4568994) * 100,
	// 							drilldown: 'ALT'
	// 						},
	// 						{
	// 							name: 'PET',
	// 							y: (163951 / 4568994) * 100,
	// 							drilldown: 'PET'
	// 						},
	// 						{
	// 							name: 'ELC_PET_HYB',
	// 							y: (374094 / 4568994) * 100,
	// 							drilldown: 'ELC_PET_HYB'
	// 						},
	// 						{
	// 							name: 'ELC_PET_PI',
	// 							y: (115885 / 4568994) * 100,
	// 							drilldown: 'ELC_PET_PI'
	// 						},
	// 						{
	// 							name: 'LPG',
	// 							y: (53672 / 4568994) * 100,
	// 							drilldown: 'LPG'
	// 						}
	// 					]
	// 				}
	// 			],
	// 			drilldown: {
	// 				series: [
	// 					{
	// 						name: 'GAS',
	// 						id: 'GAS',
	// 						data: [
	// 							['AT', 10125],
	// 							['DE', 2180680]
	// 						]
	// 					},
	// 					{
	// 						name: 'DIE',
	// 						id: 'DIE',
	// 						data: [
	// 							['AT', 14459],
	// 							['CZ', 146636]
	// 						]
	// 					},
	// 					{
	// 						name: 'ALT',
	// 						id: 'ALT',
	// 						data: [
	// 							['AT', 20180],
	// 							['BG', 352488],
	// 							['DE', 1042733],
	// 							['DK', 66926],
	// 							['ES', 8059],
	// 							['FI', 19106]
	// 						]
	// 					},
	// 					{
	// 						name: 'PET',
	// 						id: 'PET',
	// 						data: [
	// 							['BE', 18859],
	// 							['DK', 145092]
	// 						]
	// 					},
	// 					{
	// 						name: 'ELC_PET_HYB',
	// 						id: 'ELC_PET_HYB',
	// 						data: [['BG', 374094]]
	// 					},
	// 					{
	// 						name: 'ELC_PET_PI',
	// 						id: 'ELC_PET_PI',
	// 						data: [['CZ', 15885]]
	// 					},
	// 					{
	// 						name: 'LPG',
	// 						id: 'LPG',
	// 						data: [
	// 							['ES', 13290],
	// 							['FI', 40382]
	// 						]
	// 					}
	// 				]
	// 			}
	// 		});
	// }
	// async function getGrafica2() {
	// 	(function (H) {
	// 		H.seriesTypes.pie.prototype.animate = function (init) {
	// 			const series = this,
	// 				chart = series.chart,
	// 				points = series.points,
	// 				{ animation } = series.options,
	// 				{ startAngleRad } = series;

	// 			function fanAnimate(point, startAngleRad) {
	// 				const graphic = point.graphic,
	// 					args = point.shapeArgs;

	// 				if (graphic && args) {
	// 					graphic
	// 						// Set inital animation values
	// 						.attr({
	// 							start: startAngleRad,
	// 							end: startAngleRad,
	// 							opacity: 1
	// 						})
	// 						// Animate to the final position
	// 						.animate(
	// 							{
	// 								start: args.start,
	// 								end: args.end
	// 							},
	// 							{
	// 								duration: animation.duration / points.length
	// 							},
	// 							function () {
	// 								// On complete, start animating the next point
	// 								if (points[point.index + 1]) {
	// 									fanAnimate(points[point.index + 1], args.end);
	// 								}
	// 								// On the last point, fade in the data labels, then
	// 								// apply the inner size
	// 								if (point.index === series.points.length - 1) {
	// 									series.dataLabelsGroup.animate(
	// 										{
	// 											opacity: 1
	// 										},
	// 										void 0,
	// 										function () {
	// 											points.forEach((point) => {
	// 												point.opacity = 1;
	// 											});
	// 											series.update(
	// 												{
	// 													enableMouseTracking: true
	// 												},
	// 												false
	// 											);
	// 											chart.update({
	// 												plotOptions: {
	// 													pie: {
	// 														innerSize: '40%',
	// 														borderRadius: 8
	// 													}
	// 												}
	// 											});
	// 										}
	// 									);
	// 								}
	// 							}
	// 						);
	// 				}
	// 			}

	// 			if (init) {
	// 				// Hide points on init
	// 				points.forEach((point) => {
	// 					point.opacity = 0;
	// 				});
	// 			} else {
	// 				fanAnimate(points[0], startAngleRad);
	// 			}
	// 		};
	// 	})(Highcharts);

	// 	Highcharts.chart('container2', {
	// 		chart: {
	// 			type: 'pie'
	// 		},
	// 		title: {
	// 			text: 'Deaths per million inhabitants by country',
	// 			align: 'center'
	// 		},
	// 		tooltip: {
	// 			pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	// 		},
	// 		accessibility: {
	// 			point: {
	// 				valueSuffix: '%'
	// 			}
	// 		},
	// 		plotOptions: {
	// 			pie: {
	// 				allowPointSelect: true,
	// 				borderWidth: 2,
	// 				cursor: 'pointer',
	// 				dataLabels: {
	// 					enabled: true,
	// 					format: '<b>{point.name}</b><br>{point.percentage}%',
	// 					distance: 20
	// 				}
	// 			}
	// 		},
	// 		series: [
	// 			{
	// 				// Disable mouse tracking on load, enable after custom animation
	// 				enableMouseTracking: false,
	// 				animation: {
	// 					duration: 2000
	// 				},
	// 				colorByPoint: true,
	// 				//total = 16859
	// 				data: [
	// 					{
	// 						name: 'AT',
	// 						y: (1325 / 16859) * 100
	// 					},
	// 					{
	// 						name: 'BE',
	// 						y: (764 / 16859) * 100
	// 					},
	// 					{
	// 						name: 'BG',
	// 						y: (1024 / 16859) * 100
	// 					},
	// 					{
	// 						name: 'CZ',
	// 						y: (1188 / 16859) * 100
	// 					},
	// 					{
	// 						name: 'DE',
	// 						y: (8069 / 16859) * 100
	// 					},
	// 					{
	// 						name: 'DK',
	// 						y: (447 / 16859) * 100
	// 					},
	// 					{
	// 						name: 'ES',
	// 						y: (3369 / 16859) * 100
	// 					},
	// 					{
	// 						name: 'FI',
	// 						y: (673 / 16859) * 100
	// 					}
	// 				]
	// 			}
	// 		]
	// 	});
	// }

	onMount(async () => {
		getCars();
		// getGrafica2();
	});
</script>

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/highcharts-3d.js"></script>
	<script src="https://code.highcharts.com/modules/exporting.js"></script>
	<script src="https://code.highcharts.com/modules/export-data.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
	<script src="https://code.highcharts.com/modules/cylinder.js"></script>
</svelte:head>

<div id="container" style="width:100%; height:400px;"></div>
<div id="container2" style="width:100%; height:400px;"></div>
