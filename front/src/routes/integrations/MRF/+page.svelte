<script>
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';
    import Chart from 'chart.js/auto';

    let API_MRF = '/api/v2/gdp-growth-rates';
    let API_MRF_I = '/proxyMRF1';

    let errorMsg = '';
    let newData = {};

    let currentPage = 1;
    const pageSize = 10;
    let totalDatos = 0; 
    let totalPages = 1;


    if (dev) {
        API_MRF = 'http://localhost:8080' + API_MRF;
        API_MRF_I = 'http://localhost:8080' + API_MRF_I;
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

    async function initDatos() {
        let datos_MRF = await getGDP();
        let datosI = await API_MRF_First();
        console.log(datosI);
        
    }

    onMount(async () => {
        //newData = await API_MRF_I();
        initDatos();
    });

</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@3.7.0"></script>
</svelte:head>
