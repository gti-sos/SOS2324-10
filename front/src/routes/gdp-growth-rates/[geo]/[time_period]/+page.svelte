<script>

    import { page } from '$app/stores'; 
    import { dev } from "$app/environment";
    import { onMount } from 'svelte';

    let API_MRF = "/api/v2/gdp-growth-rates"; 
    if(dev)
        API_MRF = "http://localhost:8080" + API_MRF;

    let exitoMsg = '';
    let errorMsg = '';
    let dato = {};
    let nuevoDato = {};
    let showForm = false;

    let geo = $page.params.geo;
    let time_period = $page.params.time_period;

    /**
    let formData = {
        frequency: '',
        unit: '',
        na_item: '',
        time_period: 0,
        obs_value: 0,
        growth_rate_2030: 0,
        growth_rate_2040: 0
    };*/

    onMount(async () => {
        await getGDP(geo, time_period);
    });

    /**
    async function fetchGeoDetails() {
        try {
            const response = await fetch(API_MRF+`/${geo}/${time_period}`,{
                                        method: "GET"
                                        
            }); 

            const data = await response.json();
            formData = { ...data }; // Copiar los datos obtenidos en el formulario
        } catch (error) {
            console.error('Error al obtener los detalles de la geo:', error);
        }
    }
    */
   
    async function getGDP(geo, time_period) {
        try {
            let response = await fetch(API_MRF + '/' + geo + '/' + time_period, {
                method: 'GET',
                headers: {
					'Content-Type': 'application/json'
				}
            });
            console.log("URL Accedida: " +API_MRF + '/' + geo + '/' + time_period);
            if (response.status == 200) {
                let res = await response.json();
                dato = res;
                console.log("Dato: "+ dato);
            } else {
                if (response.status == 400) {
                errorMsg = 'Error en la estructura de los datos';
                alert(errorMsg);
            } else if (response.status == 409) {
                errorMsg = 'Ya existe una entrada con ese país y año';
                alert(errorMsg);
            } else if(response.status == 404){
				errorMsg = "Dato no encontrado";
				alert(errorMsg);
			}
            }
			console.log("Datos Originales: " + JSON.stringify(dato))
        } catch (e) {
            errorMsg = e;
        }
    }

    async function updateGeoDetails() {
        try {
            const response = await fetch(API_MRF+`/${geo}/${time_period}`,{
                                        method: "PUT",
                                        headers: {
                                        "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(dato)
                                         }); 
            if(response.ok){
                nuevoDato = JSON.stringify(dato);
                exitoMsg = "Dato actualizado correctamente"
                showForm = false;
               await getGDP(geo, time_period);
            }else if(!response.ok) {
                if(response.status == 400){
                    errorMsg = "Todos los campos deben ser rellenados. El pais y el año deben coincidir con los del dato a actualizar";
                } else if(response.status == 405) {
                    errorMsg = "Método no permitido";
                } else if (response.status == 409) {
                    errorMsg = "Ya existe una entrada con ese país y año";
                } else if(response.status == 404){
				    errorMsg = "Dato no encontrado";
                }
            }
        } catch (error) {
            errorMsg = error;
        }
    }
</script>

<h1>Modificar datos de {geo} en el año {time_period}</h1>
{#if !showForm}
    <!-- Vista de detalles del vehículo -->
    {#if Object.keys(dato).length > 0}
        <div class="container">
            <div class="card">
                <table>
                    <thead>
                        <th> Atributos </th>
                        <th> Valor </th>
                    </thead>
                    <tbody>
                        {#each Object.entries(dato) as [key, value]}
                            <tr>
                                <td class="attribute">{key}:</td>
                                <td class="value">
                                    {#if typeof value === 'object'}
                                        {JSON.stringify(value)}
                                    {:else}
                                        {value}
                                    {/if}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
                <div style="text-align:center ;margin-top: 20px; display: flex; justify-content: space-between;">
                    <button
                        style="background-color: #0366d6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
                        
						on:click={() => {  showForm = true; }}
                    >
                        Modificar dato
                    </button>
                </div>
            </div>
        </div>
    {:else}
        <p class="container">No hay datos disponibles</p>
    {/if}
{:else}
    <!-- Formulario para modificar la entrada -->
    <div class="container">
        <div class="card">
            <h2>Modificar dato</h2>
            <form on:submit|preventDefault={updateGeoDetails}>
				<table>
					<tbody>
						{#each Object.entries(dato) as [key, value]}
							<tr>
								<td class="attribute">{key}:</td>
								<td class="value">
									<input type="text" bind:value={dato[key]} />
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
				<div style="margin-top: 20px; display: flex; justify-content: space-between;">
					<button
						type="submit"
						style="text-align:center ;background-color: #0366d6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
						on:click={() => { showForm = false; updateGeoDetails(); }}
					>
						Guardar Cambios
					</button>
					<button
						style="background-color: #dc3545; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
						on:click={() => { showForm = false; }}
					>
						Cancelar
					</button>
				</div>
			</form>
			
        </div>
    </div>
{/if}

<!--Exito o error-->
{#if errorMsg != ""}
    <hr>ERROR: {errorMsg}
{:else}
    {#if exitoMsg != ""}
        <hr>EXITO: {exitoMsg}
    {/if}
{/if} 


<style>
    @import 'styles_2.css';
</style>