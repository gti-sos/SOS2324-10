<script>
    import {onMount} from "svelte";
    import { dev } from "$app/environment";
    import { Styles, Button, Col, Row, Table, Input } from '@sveltestrap/sveltestrap';


    let API_MRF = "/api/v2/gdp-growth-rates";
    if(dev)
        API_MRF = "http://localhost:8080" + API_MRF;

    let gdp = [];
    let showForm = false;
    let showFilter = false;
    let newGdp = {geo: "", time_period: "",
            frequency: "", unit: "", na_item: "", obs_value: "", growth_rate_2030: "",
            growth_rate_2040: ""};
    let filteredGdp = {geo: "", time_period: "",
            frequency: "", unit: "", na_item: "", obs_value: "", growth_rate_2030: "",
            growth_rate_2040: ""};
    let errorMsg = '';
    let exitoMsg = '';

    /**Rango*/
    let from = "";
    let to = "";

    /**Paginacion*/
    let currentPage = 1;
    const pageSize = 10;
    let totalDatos = 0; 
    let totalPages = 1;

    onMount(async ()=>{
       await getInitialGDP();
       await getGDP();
    })

    async function getInitialGDP(){
        try{
            console.log(gdp.length);
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
        await getGDPTotal();
        try{
            let offset = (currentPage - 1) * pageSize;
            let response = await fetch(`${API_MRF}?limit=${pageSize}&offset=${offset}`
            ,{
                                      method: "GET"
            });
            if(response.ok){
                let data = await response.json();
                gdp = data;
                console.log(data);
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

    async function getGDPTotal() {
		try {
            let offset = (currentPage - 1) * pageSize;
            let response = await fetch(API_MRF + '?limit=100',{
                                      method: "GET"
            });
			let data = await response.json();
			totalDatos = data.length;
			totalPages = Math.ceil(totalDatos / 10); // Calcular el número total de páginas
			console.log('Total páginas: ' + totalPages);
		} catch (e) {
			errorMsg = e;
		}
	}

    
    async function nextPage() {
        if ((currentPage * pageSize) <= totalDatos) {
            currentPage++;
            getGDP();
        }
    }
    
    

    async function prevPage() {
        getGDPTotal();
        if (currentPage > 1) {
            currentPage--;
            getGDP();
        }
    }

    // ------------------------------------------- FILTRO ----------------------------------------------------------
    async function getFilter() {
    try {
        let searchParams = new URLSearchParams();
        
        // Agregar los parámetros de búsqueda solo si tienen un valor
        for (const key in filteredGdp) {
            if (filteredGdp[key] !== '') {
                searchParams.append(key, filteredGdp[key]);
            }
        }

        if (from !== '' && !isNaN(from)) {
            searchParams.append('from', from);
        }
        if (to !== '' && !isNaN(to)) {
            searchParams.append('to', to);
        }

        // Construir la URL de búsqueda solo si hay parámetros de búsqueda
        let searchUrl = `${API_MRF}/search`;
        if (searchParams.toString() !== '') {
            searchUrl += `?${searchParams.toString()}`;
        }

         // Agregar paginación a la URL de búsqueda
        searchUrl += `&limit=${pageSize}&offset=${(currentPage - 1) * pageSize}`;

        console.log(searchUrl);

        // Realizar la petición GET a la API con la URL de búsqueda generada
        let response = await fetch(searchUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log(`Response status: ${response.status}`);

        if (response.ok) {
            // Actualizar los datos después de una búsqueda exitosa
            let data = await response.json();
            gdp = data;
            showFilter = false;
        } else {
            // Manejo de errores
            if (response.status == 400) {
                errorMsg = 'Estructura de datos incorrecta';
            } else if (response.status == 404) {
                errorMsg = 'Dato no encontrado';
            }
        }
    } catch (error) {
        errorMsg = error;
        console.error(error);
    }
}

    async function cleanFilter(){
            filteredGdp.frequency= "",
            filteredGdp.unit= "",
            filteredGdp.na_item= "",
            filteredGdp.geo= "",
            filteredGdp.time_period= "",
            filteredGdp.obs_value= "",
            filteredGdp.growth_rate_2030= "",
            filteredGdp.growth_rate_2040= "",
            from ="",
            to = "",
            exitoMsg = "Filtros limpiados correctamente";
            errorMsg = "";
            exitoMsg = "";
            getGDP();
    };  

    /**
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
    */

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

                        if (response.status == 200) {
                            await getGDP();
                            alert('Todas las entradas han sido eliminadas');
                            gdp = [];
                        } else {
                            if (response.status == 400) {
                                errorMsg = 'Error en la estructura de los datos';
                                alert(errorMsg);
                            } else if (response.status == 409) {
                                errorMsg = 'Ya existe una entrada con ese país y año';
                                alert(errorMsg);
                            } else if (response.status == 404) {
                                errorMsg = 'Dato no encontrado';
                                alert(errorMsg);
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


<title> gdp-growth-rates </title>

{#if gdp && gdp.length > 0}
    
    <!---->
    <div class="container">

        
        <div style="margin-bottom: 20px; display: flex; justify-content: space-between;">
			
            <!-- Botón para realizar la búsqueda -->
            <button
				style="background-color: #0366d6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
				on:click={() => {
					showFilter = true;
				}}
				>Filtros
			</button>

            <!-- Botón para limpiar la búsqueda -->
            <button
				style="background-color: #0366d6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
				on:click={() => {
					cleanFilter()
				}}
				>Borrar filtros
			</button>
		</div>
      

        <!-- Lista de objetos-->
        <table>
            <thead>
                <tr>
                    <th>Vista detallada</th>
                    {#each Object.keys(gdp[0]) as key}
                        <th>{key}</th>
                    {/each}
                    <!-- Botón de eliminar -->
                    <th>Eliminar dato</th>
                </tr>
            </thead>
            <tbody>
                {#each gdp as dato}
                    <tr>
                        <td>
                            <!-- Botón de detalles -->
                            <a href="gdp-growth-rates/{dato.geo}/{dato.time_period}"
                                style="text-decoration: none; background-color: #666666; color: white; padding: 5px 10px; border-radius: 5px; cursor: pointer; display: inline-block;">
                                Ver detalles
                            </a>
                        </td>
                        {#each Object.values(dato) as value}
                            <td>{value}</td>
                        {/each}
                        <td>
                            <!-- Botón de eliminar -->
                            <button 
                                style="background-color: #FF0000; color: white; padding: 5px 20px; border: none; border-radius: 5px; cursor: pointer;"
                                on:click={() => deleteGDP(dato.geo, dato.time_period)}>Eliminar
                            </button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>

        <!--Paginación-->
        <div style="margin-top: 20px; display: flex; justify-content: space-between;">
            <button
                style="background-color: #0366d6; color: white; padding: 5px 20px; border: none; border-radius: 5px; cursor: pointer;"
                on:click={() => prevPage()}
                >Anterior
            </button>
            <button
                style="background-color: #0366d6; color: white; padding: 5px 20px; border: none; border-radius: 5px; cursor: pointer;"
                on:click={() => nextPage()}
                > Siguiente
            </button>
        </div>

        <!--Botones inferiores-->        
        <div style="margin-top: 20px; display: flex; justify-content: space-between;">
            <!--Botón para crear dato-->
            <button
                style="background-color: #0366d6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
                on:click={() => {showForm = true;}}>
                Crear Entrada</button>
            <!--Botón para eliminar datos-->
            <button
                style="background-color: #FF0000; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
                on:click={() => {deleteGDPAll();}}>
                Eliminar Todos</button>
            <!--Botón para cargar datos-->
            <button
                style=" background-color: #0366d6; color: white; padding: 5px 20px; border: none; border-radius: 5px; cursor: pointer; "
                on:click={() => getInitialGDP()}>
                Cargar datos de prueba
            </button>
        </div>
    </div>
    


    <!-- Crear nuevo dato -->
    {#if showForm}
        <div class="modal">
            <div class="modal-content">
                <span
                    class="close"
                    on:click={() => {showForm = false;}}
                >&times;</span>
                <h2 style="color: #0366d6;">Crear nuevo dato</h2>
                <form on:submit|preventDefault={createGDP}>
                    <label>
                        Frecuencia:<!---->
                        <input type="text" id=frequency placeholder="frequency" bind:value={newGdp.frequency} style="margin-bottom: 10px;" required />
                    </label>
                    <label>
                        Unidad:
                        <input type="text" id=unit placeholder="unit" bind:value={newGdp.unit} style="margin-bottom: 10px;" required />
                    </label>
                    <label>
                        NA:
                        <input type="text" id=na_item placeholder="na_item" bind:value={newGdp.na_item} style="margin-bottom: 10px;" required />
                    </label>
                    <label
                        ><!---->
                        País:
                        <input type="text" id=geo placeholder="geo" bind:value={newGdp.geo} style="margin-bottom: 10px;" required />
                    </label>
                    <label>
                        Año:
                        <input type="number" id=time_period placeholder="time_period" bind:value={newGdp.time_period} style="margin-bottom: 10px;" required />
                    </label>
                    <label>
                        Valor Obs:
                        <input type="number" id=obs_value placeholder="valor_obs" bind:value={newGdp.obs_value} style="margin-bottom: 10px;" required />
                    </label>
                    <label> 
                        Crecimiento 2030:
                        <input type="number" id=growth_rate_2030 placeholder="growth_rate_2030" bind:value={newGdp.growth_rate_2030} style="margin-bottom: 10px;" required />
                    </label>
                    <label><!---->
                        Crecimiento 2040:
                        <input type="number" id=growth_rate_2040 placeholder="growth_rate_2040" bind:value={newGdp.growth_rate_2040} style="margin-bottom: 10px;" required />
                    </label>
                    <button type="submit" style="background-color: #0366d6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Crear</button>
                </form>
            </div>
        </div>
    {/if} 


    {#if showFilter}
		<div class="modal">
			<div class="modal-content">
				<span
					class="close"
					on:click={() => {
						showFilter = false;
					}}>&times;</span
				>
				<h2 style="color: #0366d6;">Aplicar filtros</h2>
				<form on:submit|preventDefault={getFilter}>
					<label>
                        Frecuencia:<!---->
                        <input type="text" id=frequency placeholder="frequency" bind:value={filteredGdp.frequency} style="margin-bottom: 10px;"  />
                    </label>
                    <label>
                        Unidad:
                        <input type="text" id=unit placeholder="unit" bind:value={filteredGdp.unit} style="margin-bottom: 10px;"  />
                    </label>
                    <label>
                        NA:
                        <input type="text" id=na_item placeholder="na_item" bind:value={filteredGdp.na_item} style="margin-bottom: 10px;"  />
                    </label>
                    <label
                        ><!---->
                        País:
                        <input type="text" id=geo placeholder="geo" bind:value={filteredGdp.geo} style="margin-bottom: 10px;"  />
                    </label>
                    <label>
                        Año:
                        <input type="number" id=time_period placeholder="time_period" bind:value={filteredGdp.time_period} style="margin-bottom: 10px;"  />
                    </label>
                    <label>
                        Valor Obs:
                        <input type="number" id=obs_value placeholder="frequency" bind:value={filteredGdp.obs_value} style="margin-bottom: 10px;"  />
                    </label>
                    <label> 
                        Crecimiento 2030:
                        <input type="number" id=growth_rate_2030 placeholder="growth_rate_2030" bind:value={filteredGdp.growth_rate_2030} style="margin-bottom: 10px;"  />
                    </label>
                    <label><!---->
                        Crecimiento 2040:
                        <input type="number" id=growth_rate_2040 placeholder="growth_rate_2040" bind:value={filteredGdp.growth_rate_2040} style="margin-bottom: 10px;"  />
                    </label>
                    <label><!---->
                        Desde (Año):
                        <input type="number" id=from placeholder="desde" bind:value={from} style="margin-bottom: 10px;"  />
                    </label>
                    <label><!---->
                        Hasta (Año):
                        <input type="number" id=to placeholder="hasta" bind:value={to} style="margin-bottom: 10px;"  />
                    </label>
					<button
						type="submit"
						style="background-color: #0366d6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
						>Filtrar</button
					>
				</form>
			</div>
		</div>
	{/if}

    <div class=salida>
        <!--Exito o error-->
        {#if errorMsg != ""}
            <hr>ERROR: {errorMsg}
        {:else}
            {#if exitoMsg != ""}
                <hr>EXITO: {exitoMsg}
            {/if}
        {/if}
    </div>  

   

{:else}
    <div style="justify-content: center; text-align: center; margin-top: 20px">
        <button
        style=" background-color: #0366d6; color: white; padding: 5px 20px; border: none; border-radius: 5px; cursor: pointer; "
        on:click={() => getInitialGDP()}>
        Cargar datos de prueba
        </button>
    </div>
    <p class="container">No hay datos disponibles</p>
{/if}





<style>
    @import 'styles.css';
</style>