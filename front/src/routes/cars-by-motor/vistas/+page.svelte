<script>
	import { onMount } from 'svelte';
	async function getGrafica1() {
		const chart = // Create the chart
			Highcharts.chart('container', {
				chart: {
					type: 'pie'
				},
				title: {
					text: 'Cars by motor enrgy',
					align: 'center'
				},

				accessibility: {
					announceNewData: {
						enabled: true
					},
					point: {
						valueSuffix: '%'
					}
				},

				plotOptions: {
					series: {
						borderRadius: 5,
						dataLabels: [
							{
								enabled: true,
								distance: 15,
								format: '{point.name}'
							},
							{
								enabled: true,
								distance: '-30%',
								filter: {
									property: 'percentage',
									operator: '>',
									value: 5
								},
								format: '{point.y:.1f}%',
								style: {
									fontSize: '0.9em',
									textOutline: 'none'
								}
							}
						]
					}
				},

				tooltip: {
					headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
					pointFormat:
						'<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
				},

				series: [
					{
						name: 'Motor Energies',
						colorByPoint: true,
						data: [
							{
								name: 'GAS',
								y: (2190805 / 4568994) * 100,
								drilldown: 'GAS'
							},
							{
								name: 'DIE',
								y: (161095 / 4568994) * 100,
								drilldown: 'DIE'
							},
							{
								name: 'ALT',
								y: (1509492 / 4568994) * 100,
								drilldown: 'ALT'
							},
							{
								name: 'PET',
								y: (163951 / 4568994) * 100,
								drilldown: 'PET'
							},
							{
								name: 'ELC_PET_HYB',
								y: (374094 / 4568994) * 100,
								drilldown: 'ELC_PET_HYB'
							},
							{
								name: 'ELC_PET_PI',
								y: (115885 / 4568994) * 100,
								drilldown: 'ELC_PET_PI'
							},
							{
								name: 'LPG',
								y: (53672 / 4568994) * 100,
								drilldown: 'LPG'
							}
						]
					}
				],
				drilldown: {
					series: [
						{
							name: 'GAS',
							id: 'GAS',
							data: [
								['AT', 10125],
								['DE', 2180680]
							]
						},
						{
							name: 'DIE',
							id: 'DIE',
							data: [
								['AT', 14459],
								['CZ', 146636]
							]
						},
						{
							name: 'ALT',
							id: 'ALT',
							data: [
								['AT', 20180],
								['BG', 352488],
								['DE', 1042733],
								['DK', 66926],
								['ES', 8059],
								['FI', 19106]
							]
						},
						{
							name: 'PET',
							id: 'PET',
							data: [
								['BE', 18859],
								['DK', 145092]
							]
						},
						{
							name: 'ELC_PET_HYB',
							id: 'ELC_PET_HYB',
							data: [['BG', 374094]]
						},
						{
							name: 'ELC_PET_PI',
							id: 'ELC_PET_PI',
							data: [['CZ', 15885]]
						},
						{
							name: 'LPG',
							id: 'LPG',
							data: [
								['ES', 13290],
								['FI', 40382]
							]
						}
					]
				}
			});
	}
	async function getGrafica2(){
		(function (H) {
    H.seriesTypes.pie.prototype.animate = function (init) {
        const series = this,
            chart = series.chart,
            points = series.points,
            {
                animation
            } = series.options,
            {
                startAngleRad
            } = series;

        function fanAnimate(point, startAngleRad) {
            const graphic = point.graphic,
                args = point.shapeArgs;

            if (graphic && args) {

                graphic
                    // Set inital animation values
                    .attr({
                        start: startAngleRad,
                        end: startAngleRad,
                        opacity: 1
                    })
                    // Animate to the final position
                    .animate({
                        start: args.start,
                        end: args.end
                    }, {
                        duration: animation.duration / points.length
                    }, function () {
                        // On complete, start animating the next point
                        if (points[point.index + 1]) {
                            fanAnimate(points[point.index + 1], args.end);
                        }
                        // On the last point, fade in the data labels, then
                        // apply the inner size
                        if (point.index === series.points.length - 1) {
                            series.dataLabelsGroup.animate({
                                opacity: 1
                            },
                            void 0,
                            function () {
                                points.forEach(point => {
                                    point.opacity = 1;
                                });
                                series.update({
                                    enableMouseTracking: true
                                }, false);
                                chart.update({
                                    plotOptions: {
                                        pie: {
                                            innerSize: '40%',
                                            borderRadius: 8
                                        }
                                    }
                                });
                            });
                        }
                    });
            }
        }

        if (init) {
            // Hide points on init
            points.forEach(point => {
                point.opacity = 0;
            });
        } else {
            fanAnimate(points[0], startAngleRad);
        }
    };
}(Highcharts));

Highcharts.chart('container2', {
    chart: {
        type: 'pie'
    },
    title: {
        text: 'Deaths per kilometre by country',
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
    series: [{
        // Disable mouse tracking on load, enable after custom animation
        enableMouseTracking: false,
        animation: {
            duration: 2000
        },
        colorByPoint: true,
        data: [{
            name: 'Customer Support',
            y: 21.3
        }, {
            name: 'Development',
            y: 18.7
        }, {
            name: 'Sales',
            y: 20.2
        }, {
            name: 'Marketing',
            y: 14.2
        }, {
            name: 'Other',
            y: 25.6
        }]
    }]
});

	}
	onMount(() => {
		getGrafica1();
		getGrafica2();
	});
</script>

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
</svelte:head>

<div id="container" style="width:100%; height:400px;"></div>
<div id="container2" style="width:100%; height:400px;"></div>