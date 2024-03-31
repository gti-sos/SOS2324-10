<script>
    import {onMount} from "svelte";
    
    let API_ASB = "http://localhost:8080/api/v2/cars-by-motor";
    let showForm = false;
    let cars = [];
    let newCar = {
        // dataflow: '',
        // last_update: '',
        freq: '',
        unit: '',
        motor_nrg: '',
        geo: '',
        time_period: '',
        obs_value: '',
        obs_flag: '',
        millions_of_passenger_per_kilometres: '',
        road_deaths_per_million_inhabitants: ''
    };
    let errorMsg = '';
    let successMsg = '';

    onMount(async ()=>{
       await getCars();
    })

    
    async function loadInitialData() {
		try {
			if (cars.length === 0) {
				let response = await fetch(API_ASB + '/loadInitialData', {
					method: 'GET'
				});

				if (response.status==200) {
					getCars();
					alert('Datos Cargados Correctamente');
				} else {
					errorMsg = 'La base de datos no está vacía';
				}
			} else {
				errorMsg = 'La base de datos no está vacía';
			}
		} catch (error) {
			errorMsg = error;
		}
	}
    async function getCars(){
        console.log(cars);
        try{
            let response = await fetch(API_ASB,{
                                      method: "GET"
            });
            if (response.ok) {
                let data = await response.json();
                cars = data;
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

    async function createCar(){
        try{
            let response = await fetch(API_ASB,{
                                      method: "POST",
                                      headers: {
                                        "Content-Type": "application/json"
                                      },
                                      body: JSON.stringify(newCar)
                                    });
            if(response.status == 201){
                showForm = false;
                successMsg = "Dato creado correctamente";
                errorMsg = "";
                await getCars();
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

    async function deleteCars(){
        try{
            let response = await fetch(API_ASB,{
                            method: "DELETE"
                                    });
                                    if(response.ok){
            await getCars();
            successMsg = "Todos los datos fueron eliminados"
            errorMsg = "";
            }else{
                if(response.status == 404){
                    errorMsg = "No existen datos en la base de datos";
                }
                
            }
        } catch(e){
            errorMsg = e;
        }
    }

    async function deleteCar(geo, time_period){
        try{
            let response = await fetch(API_ASB+'/' + geo + '/' + time_period,{
                              method: "DELETE"
                                        });
            if(response.status == 200){
                await getCars();
             
                if (cars.length === 0) {
                    errorMsg = "No hay datos disponibles";
                }
                
                successMsg = "Dato eliminado correctamente";
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

{#if cars && cars.length > 0}
    <div class="container">
        <div style="margin-bottom: 20px; display: flex; justify-content: space-between;">
            <table>
                <thead>
                    <tr>
                        <!-- <th>id</th> Aquí colocamos primero la columna del ID -->
                        {#each Object.keys(cars[0]) as key}
                            {#if key !== 'id'} <!-- Evitamos mostrar la columna ID nuevamente -->
                                <th>{key}</th>
                            {/if}
                        {/each}
                        <th>modificar</th> <!-- Nuevo encabezado para el botón Modificar -->
                        <th>eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {#each cars as car}
                        <tr>
                            <!-- <td>{car.id}</td> Aquí mostramos primero el ID -->
                            {#each Object.entries(car) as [key, value]} <!-- Usamos Object.entries para mantener el orden de las propiedades -->
                                {#if key !== 'id'} <!-- Evitamos mostrar la columna ID nuevamente -->
                                    <td>
                                        {value}
                                    </td>
                                {/if}
                            {/each}
                            <td>
                                <!-- <button
                                
                                    style="background-color: #007bff; color: white; padding: 5px 20px; border: none; border-radius: 5px; cursor: pointer;"
                                    on:click={() => modifyCar(car.geo, car.time_period)}>Modificar</button> -->
                                    <a
                                    href="/cars-by-motor/{car.geo}/{car.time_period}"
                                    style="background-color: #007bff; color: white; padding: 5px 20px; border: none; border-radius: 5px; cursor: pointer; text-decoration: none;"
                                    >Modificar</a>
                            </td>
                            <td>
                                <button
                                    style="background-color: #E85A4F; color: white; padding: 5px 20px; border: none; border-radius: 5px; cursor: pointer;"
                                    on:click={() => deleteCar(car.geo, car.time_period)}>Eliminar</button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        <div style="margin-top: 20px; display: flex; justify-content: space-between;">
            <button
                style="background-color: #33BF30; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
                on:click={() => {
                    showForm = true;
                }}>Agregar Nuevo</button>
            <button
                style="background-color: #FF0000; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
                on:click={() => {
                    deleteCars();
                }}>Eliminar Todo</button>
        </div>
    </div>
        {#if showForm}
            <div class="custom-modal">
                <div class="modal-content">
                    <span
                        class="close"
                        on:click={() => {
                            showForm = false;
                        }}>&times;</span>
                    <h2 style="color: #33BF30;">Agregar Nueva Entrada</h2>
                    <form on:submit|preventDefault={createCar}>
                        <label>
                            Freq:
                            <input type="text" bind:value={newCar.freq} style="margin-bottom: 10px;" required />
                        </label>
                        <label>
                            Unit:
                            <input type="text" bind:value={newCar.unit} style="margin-bottom: 10px;" required />
                        </label>
                        <label>
                            Motor NRG:
                            <input type="text" bind:value={newCar.motor_nrg} style="margin-bottom: 10px;" required />
                        </label>
                        <label>
                            Geo:
                            <input type="text" bind:value={newCar.geo} style="margin-bottom: 10px;" required />
                        </label>
                        <label>
                            Time Period:
                            <input type="number" bind:value={newCar.time_period} style="margin-bottom: 10px;" required />
                        </label>
                        <label>
                            Obs Value:
                            <input type="number" bind:value={newCar.obs_value} style="margin-bottom: 10px;" required />
                        </label>
                        <label>
                            Obs Flag:
                            <input type="text" bind:value={newCar.obs_flag} style="margin-bottom: 10px;" required />
                        </label>
                        <label>
                            Millions of Passengers per Kilometre:
                            <input
                                type="number"
                                bind:value={newCar.millions_of_passenger_per_kilometres}
                                style="margin-bottom: 10px;"
                                required
                            />
                        </label>
                        <label>
                            Road Deaths per Million Inhabitants:
                            <input
                                type="number"
                                bind:value={newCar.road_deaths_per_million_inhabitants}
                                style="margin-bottom: 10px;"
                                required
                            />
                        </label>
                        <button
                            type="submit"
                            style="background-color: #33BF30; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
                            >Agregar</button
                        >
                    </form>
                </div>
            </div>
        {/if}
        {:else}
        <button
            style="background-color: #33BF30; color: white; padding: 5px 20px; border: none; border-radius: 5px; cursor: pointer;"
            on:click={() => loadInitialData()}
        >
            Cargar datos
        </button>
        <p class="container">No hay datos disponibles</p>  
{/if}
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

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th {
        background-color: #70d0a2; 
    }

    td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: justify;
    }

    .modal-content {
        background-color: #fefefe; 
        margin: 15% auto; 
        padding: 20px;
        border: 1px solid #888;
        width: 50%;
        border-radius: 5px;
        box-shadow:
            0 4px 8px 0 rgba(0, 0, 0, 0.2),
            0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }
</style>

{#if errorMsg != ""}
    <hr>ERROR: {errorMsg}
{:else}
    {#if successMsg != ""}
        <hr>EXITO: {successMsg}
    {/if}
{/if}