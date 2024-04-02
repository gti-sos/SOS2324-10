<script>
    //Librería para obtener recursos de la URL
    import { page } from '$app/stores';
    let API_TLR = '/api/v2/vehicles-stock';
    import { dev } from '$app/environment';
    import { onMount } from 'svelte';

    if (dev) {
        API_TLR = 'http://localhost:8080' + API_TLR;
    }
    let dato = {};
    let errorMsg = '';
    let showForm = false;
    let modifiedData = {}; // Para almacenar los datos modificados

    let geo = $page.params.geo;
    let year = $page.params.year;

    onMount(async () => {
        await getVehicle(geo, year);
    });

    //Función para obtener la entrada
    async function getVehicle(geo, year) {
        try {
            let response = await fetch(API_TLR + '/' + geo + '/' + year, {
                method: 'GET',
                headers: {
					'Content-Type': 'application/json'
				}
            });
            console.log("URL Accedida: " +API_TLR + '/' + geo + '/' + year);
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

    // Función para enviar la modificación
    async function putVehicle() {
        try {
			
            let response = await fetch(API_TLR + '/' + geo + '/' + year, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dato)
            });

            if (response.status == 200) {
				modifiedData = JSON.stringify(dato);
                showForm = false; // Cerrar el formulario después de modificar
                await getVehicle(geo, year); // Volver a cargar los datos actualizados
            } else {
				if (response.status == 400) {
                errorMsg = 'No puedes cambiar ni el país ni el año manito';
                alert(errorMsg);
            } else if (response.status == 409) {
                errorMsg = 'Ya existe una entrada con ese país y año';
                alert(errorMsg);
            } else if(response.status == 404){
				errorMsg = "Dato no encontrado";
				alert(errorMsg);
			}
            }
			
			console.log("Datos Modificados: "+JSON.stringify(modifiedData));
        } catch (e) {
            errorMsg = e;
        }
    }
</script>

<h2>Vehicle details from {geo}:{year}</h2>

<!-- Vista de detalles del vehículo -->
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
                        Modificar Entrada
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
            <h2>Modificar Entrada</h2>
            <form on:submit|preventDefault={putVehicle}>
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
						on:click={() => { showForm = false; putVehicle(); }}
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

{#if errorMsg}
    <p class="error">ERROR: {errorMsg}</p>
{/if}
<style>
	
	.card {
		background-color: #ffffff;
		border: 1px solid #a4caef;
		border-radius: 5px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		padding: 20px;
		max-width: 600px;
		margin: 0 auto;
	}
	

	table {
		width: 100%;
		border-collapse: collapse;
	}
	td {
		border: 1px solid #ddd;
		padding: 8px;
		text-align: left;
	}

	th {
		background-color: #f2f2f2; /* Gris claro */
	}

	tr:nth-child(even) {
		background-color: #f2f2f2; /* Gris claro */
	}

	tr:hover {
		background-color: #e2e2e2; /* Gris más claro */
	}

	.value {
		width: 50%; /* Ancho de la columna de valores */
	}

	/* Estilo para los títulos */
	h2 {
		text-align: center;
		color: #0366d6; /* Azul */
	}

    /* Estilos para los inputs del formulario */
    input[type='text'] {
        width: 100%;
        padding: 12px 20px;
        margin: 8px 0;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 4px;
        resize: vertical;
    }

    input[type='text']:focus {
        border: 3px solid #555;
    }

    /* Estilo para los mensajes de error */
    .error {
        color: red;
        font-weight: bold;
    }
</style>
