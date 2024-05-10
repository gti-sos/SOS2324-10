<script>
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';
    //import * as echarts from 'echarts';
    let echarts = window.echarts;

    let API_MRF = '/api/v2/gdp-growth-rates';
    let API_MRF_I = '/proxyMRF1';
    let API_MRF_II = '/proxyMRF2';

    let errorMsg = '';
    let gdp = [];

    let currentPage = 1;
    const pageSize = 10;
    let totalDatos = 0; 
    let totalPages = 1;


    if (dev) {
        API_MRF = 'http://localhost:8080' + API_MRF;
        API_MRF_I = 'http://localhost:8080' + API_MRF_I;
        API_MRF_II = 'http://localhost:8080' + API_MRF_II;
    }

    async function getInitialGDP(){
        try{
           
            if(gdp.length === 0){

                let response = await fetch(API_MRF+"/loadInitialData",{
                                      method: "GET"
                });

                if(response.ok){
                    getGDP();
                    exitoMsg = "Datos cargados correctamente";
                    errorMsg = "";
                } else {
                    errorMsg = "Ya existen datos en la base de datos";
                }
            } else {
                errorMsg = "Ya existen datos en la base de datos";
            }
            
        } catch(e){
            errorMsg = e;
        }
        
    }

    async function getGDP(){
        
        try{
            let offset = (currentPage - 1) * pageSize;
            let response = await fetch(`${API_MRF}?limit=${pageSize}&offset=${offset}`
            ,{
                                      method: "GET",
                                      headers: {
                                        'Cache-Control': 'no-cache',
					                    Pragma: 'no-cache'
                                      }
            });
            if(response.ok){
                let data = await response.json();
                gdp = data;
                return gdp;
            } else {
                if(response.status == 404){
                    errorMsg = "No hay datos en la base de datos";
                } else {
                    errorMsg = `Error ${response.status}: ${response.statusText}`;
                }
            }
        } catch(e){
            errorMsg = e;
        }
        
    }

                        // ------------------ INTEGRACIÓN I -----------------------


    async function API_MRF_First() {
        try {
            let response = await fetch(API_MRF_I, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache',
					Pragma: 'no-cache',
                    'X-RapidAPI-Key': '77e71d3380msh154aec6377535a9p1b8f1ajsnec607687032a',
                    'X-RapidAPI-Host': 'beers-list.p.rapidapi.com'
                }
            });

            if (response.ok) {
                let data = await response.json();
                return data;
            } else {
                if (response.status == 404) {
                    errorMsg = 'Error: no hay datos';
                } else {
                    errorMsg = `Error ${response.status}: ${response.statusText}`;
                }
            }
        } catch (e) {
            errorMsg = e;
        }
    }

    function modDataI(array1, array2) {
        //console.log("Datos del primer array:", array1);
        //console.log("Datos del segundo array:", array2);

        // Filtrar los países que están en ambas listas de datos
        const commonCountries = array1.filter((entry) => {
            return array2.some((item) => item.country === entry.geo);
        });
        //console.log("Países comunes:", commonCountries);

        // Obtener los países comunes y sus datos combinados
        const combinedData = commonCountries.map((country) => {
            const data1 = array1.find((entry) => entry.geo === country.geo);
            const countryBeers = array2.filter((item) => item.country === country.geo);
            const totalBeerCount = countryBeers.length; // Sumatorio de marcas de cerveza
            return {
                country: country.geo,
                growth_rate_2030: data1 ? data1.growth_rate_2030 : 0,
                beerCount: totalBeerCount
            };
        });
        //console.log("Datos combinados:", combinedData);

        return combinedData;
    }


    function createGraphI(data) {
        const chartDom = document.getElementById('barChart');
        const myChart = echarts.init(chartDom);
        const option = {
            title: {
                text: 'Growth Rate 2030 vs. Beer Count by Country'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['Growth Rate 2030', 'Beer Count']
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                data: data.map(entry => entry.country),
            },
            yAxis: [
                {
                    type: 'value',
                    name: 'Growth Rate 2030',
                    position: 'left',
                },
                {
                    type: 'value',
                    name: 'Beer Count',
                    position: 'right',
                },
            ],
            series: [
                {
                    name: 'Growth Rate 2030',
                    type: 'bar',
                    yAxisIndex: 0,
                    data: data.map(entry => entry.growth_rate_2030),
                },
                {
                    name: 'Beer Count',
                    type: 'bar',
                    yAxisIndex: 1,
                    data: data.map(entry => entry.beerCount),
                },
            ]
        };
        option && myChart.setOption(option);
    }



    // ------------------ INTEGRACIÓN II -----------------------


    async function API_MRF_Second() {
        try {
            let response = await fetch(API_MRF_II, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache',
					Pragma: 'no-cache',
                    'X-RapidAPI-Key': '77e71d3380msh154aec6377535a9p1b8f1ajsnec607687032a',
                    'X-RapidAPI-Host': 'deaths-by-european-countries.p.rapidapi.com'
                }
            });

            if (response.ok) {
                let data = await response.json();
                return data;
            } else {
                if (response.status == 404) {
                    errorMsg = 'Error: no hay datos';
                } else {
                    errorMsg = `Error ${response.status}: ${response.statusText}`;
                }
            }
        } catch (e) {
            errorMsg = e;
        }
    }

     // ------------------ INTEGRACIÓN III -----------------------
    
    async function initDatos() {
        await getInitialGDP();
        let datos_MRF = await getGDP();
        let datosI = await API_MRF_First();
        let datosII = await API_MRF_Second();
        
        let graphDataI = modDataI(datos_MRF, datosI);
        createGraphI(graphDataI);        
        
    }

    onMount(async () => {
        initDatos();
    });

</script>

<div id="barChart" style="width: 800px; height: 600px;"></div>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@3.7.0"></script>
    <script src="https://cdn.jsdelivr.net/npm/echarts@latest/dist/echarts.min.js"></script>
</svelte:head>
