<script>
    import {onMount} from "svelte";
    import { dev } from "$app/environment";
    import { Styles, Button, Col, Row, Table, Input } from '@sveltestrap/sveltestrap';


    let API_MRF = "/api/v2/gdp-growth-rates";
    if(dev)
        API_MRF = "http://localhost:8080" + API_MRF;

    let gdp = [];
    let showForm = false;
    let newGdp = {geo: "", time_period: "", dataflow: "", last_update: "",
            frequency: "", unit: "", na_g: "", obs_value: "", growth_rate_2030: "",
            growth_rate_2040: ""};
    let errorMsg = '';
    let exitoMsg = '';

    /**Paginacion*/
    let currentPage = 1;
    let totalItems = 0;
    const pageSize = 10;

    onMount(async ()=>{
       await getGDP();
    })

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
                                      method: "GET"
            });
            if(response.ok){
                let {data, total} = await response.json();
                gdp = data;
                console.log(data);
                totalItems = total;
                errorMsg = "";
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

    async function nextPage() {
        if ((currentPage * pageSize) < totalItems) {
            currentPage++;
            getGDP();
        }
    }

    async function prevPage() {
        if (currentPage > 1) {
            currentPage--;
            getGDP();
        }
    }

    async function searchGDP() {
        const country = document.getElementById('countryInput').value.trim();
        const from = document.getElementById('fromInput').value.trim();
        const to = document.getElementById('toInput').value.trim();

        let url = `${API_MRF}?`;

        // Verificar qué campos están completados y agregarlos a la URL
        if (country !== '') {
            url += `geo=${encodeURIComponent(country)}&`;
        }
        if (from !== '') {
            url += `from=${encodeURIComponent(from)}&`;
        }
        if (to !== '') {
            url += `to=${encodeURIComponent(to)}&`;
        }

        // Eliminar el último '&' de la URL si está presente
        if (url.endsWith('&')) {
            url = url.slice(0, -1);
        }

        try {
            const response = await fetch(url, {
                method: 'GET'
            });

            if (response.ok) {
                const { data } = await response.json();
                gdp = data; 
                exitoMsg = "Búsqueda realizada correctamente";
                errorMsg = '';
            } else {
                errorMsg = "Error en la búsqueda";
            }
        } catch (e) {
            errorMsg = e;
        }
    }


    async function createGDP(){
        try{
            await getGDP();
            let response = await fetch(API_MRF,{
                                      method: "POST",
                                      headers: {
                                        "Content-Type": "application/json"
                                      },
                                      body: JSON.stringify(newGdp)
                                    });

        if(response.ok){
            showForm = false;
            getGDP();
            exitoMsg = "Dato creado correctamente";
            errorMsg = "";
        } else {
            if(response.status == 400){
                errorMsg = "Todos los datos deben ser introducidos";
            } else if (response.status == 405){
                errorMsg = "Método no permitido";
            } else if (response.status == 409){
                errorMsg = "Elemento ya existente"
            }
        }
        }catch(e){
            errorMsg = e;
        }
        

    }

    async function deleteGDPAll(){
        
        try{
            let response = await fetch(API_MRF,{
                                    method: "DELETE"
                        });
            
            if(response.ok){
                await getGDP();
                exitoMsg = "Todos los datos fueron eliminados"
                errorMsg = "";
            }else{
                if(reponse.status == 404){
                    errorMsg = "No existen datos en la base de datos";
                }
                
            }
        } catch(e){
            errorMsg = e;
        }


    }

    async function deleteGDP(geo, time_period){
        
        try{
            
            let response = await fetch(API_MRF + "/" + geo + "/" + time_period,{
                                      method: "DELETE"
                        });
            if(response.ok){
                await getGDP();
             
                if (gdp.length === 0) {
                    errorMsg = "No hay datos disponibles";
                }
                
                exitoMsg = "Dato eliminado correctamente";
                errorMsg = "";
            } else {
                if(response.status == 400){
                    errorMsg = "Fallo en el dato"
                } else if(response.status == 404){
                    errorMsg = "Dato no existente en la base de datos"
                } else if (response.status == 409) {
                    errorMsg = 'Ya existe una entrada con ese país y año';
                }
            } 
          
        } catch(e){
            errorMsg = e;
        }
     
    }



</script>

<!-- Elementos de entrada para los parámetros de búsqueda -->
<input type="text" id="fromInput" placeholder="From">
<input type="text" id="toInput" placeholder="To">
<input type="text" id="countryInput" placeholder="País">

<!-- Botón para realizar la búsqueda -->
<button on:click="{searchGDP}">Buscar</button>


{#if gdp && gdp.length > 0}
    <div class="container">
        <table>
            <thead>
                <tr>
                    <th>Geo</th>
                    <th>Time Period</th>
                    <th>Frequency</th>
                    <th>Unit</th>
                    <th>NA item</th>
                    <th>Obs Value</th>
                    <th>Growth Rate 2030</th>
                    <th>Growth Rate 2040</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {#each gdp as g, index}
                    <tr>
                        <td><a href="/gdp-growth-rates/{g.geo}/{g.time_period}">{g.geo}</a></td>
                        <td>{g.time_period}</td>
                        <td>{g.frequency}</td>
                        <td>{g.unit}</td>
                        <td>{g.na_item}</td>
                        <td>{g.obs_value}</td>
                        <td>{g.growth_rate_2030}</td>
                        <td>{g.growth_rate_2040}</td>
                        <td><button class="delete-button" on:click={() => deleteGDP(g.geo, g.time_period)}>Borrar dato</button></td>
                    </tr>
                {/each}
            </tbody>
        </table>

       
    </div>

    {#if showForm}
        <div class="modal">
            <div class="modal-content">
                <span class="close" on:click={() => { showForm = false; }}>&times;</span>
                <h2 style="color: #0366d6;">Crear Nueva Entrada</h2>
                <form on:submit|preventDefault={createGDP}>
                    <label>
                        Geo:
                        <input type="text" bind:value={newGdp.geo} style="margin-bottom: 10px;" required />
                    </label>
                    <label>
                        Time Period:
                        <input type="number" bind:value={newGdp.time_period} style="margin-bottom: 10px;" required />
                    </label>
                    <label>
                        Frequency:
                        <input type="text" bind:value={newGdp.frequency} style="margin-bottom: 10px;" required />
                    </label>
                    <label>
                        Unit:
                        <input type="text" bind:value={newGdp.unit} style="margin-bottom: 10px;" required />
                    </label>
                    <label>
                        NA item:
                        <input type="text" bind:value={newGdp.na_item} style="margin-bottom: 10px;" required />
                    </label>
                    <label>
                        Obs Value:
                        <input type="number" bind:value={newGdp.obs_value} style="margin-bottom: 10px;" required />
                    </label>
                    <label>
                        Growth Rate 2030:
                        <input type="number" bind:value={newGdp.growth_rate_2030} style="margin-bottom: 10px;" required />
                    </label>
                    <label>
                        Growth Rate 2040:
                        <input type="number" bind:value={newGdp.growth_rate_2040} style="margin-bottom: 10px;" required />
                    </label>
                    <button type="submit" style="background-color: #0366d6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Crear</button>
                </form>
            </div>
        </div>
    {/if}

  

    

    {#if errorMsg != ""}
        <hr>ERROR: {errorMsg}
    {:else}
        {#if exitoMsg != ""}
            <hr>EXITO: {exitoMsg}
        {/if}
    {/if}

   

{:else}
	<p class="container">No hay datos disponibles</p>
{/if}

   <!-- Botones fuera de la tabla -->
<div style="margin-top: 20px; display: flex; justify-content: space-between;">
    <button on:click={() => {showForm = true;}}>Crear Nuevo Dato</button>
    <button on:click="{deleteGDPAll}">Borrar Todos los Datos</button>
    <button on:click="{getInitialGDP}">Cargar Datos de Prueba</button>
</div>

<!-- Botones para navegar entre páginas -->
<div style="margin-top: 20px; display: flex; justify-content: space-between;">
    <button on:click="{prevPage}">Página Anterior</button>
    <button on:click="{nextPage}">Página Siguiente</button>
</div>


<style>
    /* Estilos CSS para la tabla */
    .table {
        width: 100%;
        border-collapse: collapse;
    }
    .table th, .table td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }
    .table th {
        background-color: #f2f2f2;
    }
    .table tr:nth-child(even) {
        background-color: #f9f9f9;
    }
    .table tr:hover {
        background-color: #f2f2f2;
    }
    .delete-button {
        background-color: #f44336;
        color: white;
        border: none;
        padding: 5px 10px;
        cursor: pointer;
        border-radius: 5px;
    }
</style>