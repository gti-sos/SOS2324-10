<script>
    import {onMount} from "svelte";
    import {dev} from "$app/environment";
    import { page } from '$app/stores';

    let API_ASB = "api/v2/cars-by-motor";

    if(dev)
        API_ASB = "http://localhost:8080/" + API_ASB;

    let showForm = false;
    let car = {};
    let geo = $page.params.geo;
    let time_period = $page.params.time_period;
    let errorMsg = '';
    let successMsg = '';

    onMount(()=>{
        getCars();
    })

    

    async function getCars(){
        try{
            let response = await fetch(API_ASB, + '/' + geo + '/' + time_period,{
                                      method: "GET"
            });
            if (response.ok) {
                let data = await response.json();
                car = data;
                console.log(data);
                errorMsg = '';
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

    async function modifyCar() {
		try {
			let response = await fetch(
				API_ASB + '/' + geo +'/' + time_period,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(car)
				}
			);
			if (response.ok) {
                showForm = false;
				await getCars();
				exitMsg = 'Dato actualizado correctamente';
			} else {
				errorMsg = 'Error al actualizar el dato';
			}
		} catch (e) {
			errorMsg = e;
		}
	}
</script>
<div class="container">
    <div style="margin-bottom: 20px; display: flex; justify-content: space-between;">
        <table>
            <tbody>
                {#each Object.entries(car) as [key, value]} <!-- Usamos Object.entries para mantener el orden de las propiedades -->
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
                        <!-- <td>
                            <button
                                style="background-color: #E85A4F; color: white; padding: 5px 20px; border: none; border-radius: 5px; cursor: pointer;"
                                on:click={() => modifyCar(car.geo, car.time_period)}>Actualizar</button>
                        </td> -->
            </tbody>
        </table>
    </div>
    <div style="margin-top: 20px; display: flex; justify-content: space-between;">
        <button
            style="background-color: #33BF30; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
            on:click={() => {
                showForm = true;
            }}>Actualizar</button>
    </div>
</div>

<style>
    .container {
        width: 80%;
        margin: 50px auto;
        background-color: #ffffff; 
        border: 1px solid #a4caef; 
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        padding: 20px;
    }

    .form-group {
        margin-bottom: 20px;
    }

    label {
        display: block;
        font-weight: bold;
        margin-bottom: 5px;
    }

    input[type="text"] {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 5px;
    }

    button[type="submit"] {
        margin-top: 10px;
    }
</style>
