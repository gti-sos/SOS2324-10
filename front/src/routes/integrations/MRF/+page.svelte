<script>
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';
    import Chart from 'chart.js/auto';

    let API_MRF = '/api/v2/gdp-growth-rates';
    let errorMsg = '';
    
    let newData = {};

    if (dev) {
        API_MRF = 'http://localhost:8080' + API_MRF;
    }

    async function API_MRF_I() {
        try {
            let response = await fetch(`https://world-countries-data.p.rapidapi.com/countries/all-countries`, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'X-RapidAPI-Key': '77e71d3380msh154aec6377535a9p1b8f1ajsnec607687032a',
                    'X-RapidAPI-Host': 'world-countries-data.p.rapidapi.com'
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

    onMount(async () => {
        newData = await API_MRF_I();
        console.log(newData);
    });
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@3.7.0"></script>
</svelte:head>
