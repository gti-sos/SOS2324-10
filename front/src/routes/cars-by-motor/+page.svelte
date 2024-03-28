<script>
    import {onMount} from "svelte";
    import {dev} from "$app/environment";
    
    let API_ASB = "http://localhost:8080/api/v2/cars-by-motor";
    let showForm = false;
    let cars = [];
    let newCar = {
        dataflow: '',
        last_update: '',
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

    onMount(()=>{
        getCars();
    })

    async function getCars(){
        console.log(cars);
        try{
            let response = await fetch(API_ASB,{
                                      method: "GET"
            });
            if(response.ok){
                let {data, total} = await response.json();
                cars = data;
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

    async function createCar(){
        try{
            await getCars();
            let response = await fetch(API_ASB,{
                                      method: "POST",
                                      headers: {
                                        "Content-Type": "application/json"
                                      },
                                      body: JSON.stringify(newCar)
                                    });
                                    if(response.ok){
            getCars();
            successMsg = "Dato creado correctamente";
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

    async function deleteCars(){
        try{
            let response = await fetch(API_ASB,{
                            method: "DELETE"
                                    });
                                    if(response.ok){
            await getcars();
            successMsg = "Todos los datos fueron eliminados"
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

    async function deleteCar(geo, time_period){
        try{
            let response = await fetch(API_ASB+'/' + geo + '/' + time_period,{
                              method: "DELETE"
                                        });
            if(response.ok){
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
<div class="custom-container">
    <div style="margin-bottom: 20px; display: flex; justify-content: space-between;">
    </div>
    <table>
        <thead>
            <tr>
                <th>Ver Detalles</th>
                <th>Dataflow</th>
                <th>Last Update</th>
                <th>Freq</th>
                <th>Unit</th>
                <th>Motor NRG</th>
                <th>Geo</th>
                <th>Time Period</th>
                <th>Obs Value</th>
                <th>Obs Flag</th>
                <th>Millions of Passengers per Kilometre</th>
                <th>Road Deaths per Million Inhabitants</th>
                <th>Eliminar</th>
            </tr>
        </thead>
        <tbody>
            {#each cars as car}
                <tr>
                    <td>
                        <!-- Botón de detalles -->
                        <a
                            href="/cars-by-motor/{car.geo}/{car.time_period}"
                            style="text-decoration: none; background-color: #2C7873; color: white; padding: 5px 10px; border-radius: 5px; cursor: pointer; display: inline-block;"
                        >
                            Detalles
                        </a>
                    </td>
                    {#each Object.values(car) as value}
                        <td>{value}</td>
                    {/each}
                    <!---->
                    <td>
                        <button
                            style="background-color: #E85A4F; color: white; padding: 5px 20px; border: none; border-radius: 5px; cursor: pointer;"
                            on:click={() => deleteCar(car.geo, car.time_period)}>Eliminar</button
                        >
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>

    <!-- Botones adicionales -->
    <div style="margin-top: 20px; display: flex; justify-content: space-between;">
        <button
            style="background-color: #39A2DB; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
            on:click={() => {
                showForm = true;
            }}>Agregar Nuevo</button>
        <!---->
        <button
            style="background-color: #9BC53D; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
            on:click={() => {
                deleteCars();
            }}>Eliminar Todo</button>
    </div>
</div>

<!-- Formulario para crear nueva entrada -->
{#if showForm}
    <div class="custom-modal">
        <div class="modal-content">
            <span
                class="close"
                on:click={() => {
                    showForm = false;
                }}>&times;</span>
            <h2 style="color: #8D8741;">Agregar Nueva Entrada</h2>
            <form on:submit|preventDefault={createCar}>
                <label>
                    Dataflow:
                    <input type="text" bind:value={newCar.dataflow} style="margin-bottom: 10px;" required />
                </label>
                <label>
                    Last Update:
                    <input type="text" bind:value={newCar.last_update} style="margin-bottom: 10px;" required />
                </label>
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
                    <input type="text" bind:value={newCar.time_period} style="margin-bottom: 10px;" required />
                </label>
                <label>
                    Obs Value:
                    <input type="text" bind:value={newCar.obs_value} style="margin-bottom: 10px;" required />
                </label>
                <label>
                    Obs Flag:
                    <input type="text" bind:value={newCar.obs_flag} style="margin-bottom: 10px;" required />
                </label>
                <label>
                    Millions of Passengers per Kilometre:
                    <input
                        type="text"
                        bind:value={newCar.millions_of_passenger_per_kilometres}
                        style="margin-bottom: 10px;"
                        required
                    />
                </label>
                <label>
                    Road Deaths per Million Inhabitants:
                    <input
                        type="text"
                        bind:value={newCar.road_deaths_per_million_inhabitants}
                        style="margin-bottom: 10px;"
                        required
                    />
                </label>
                <button
                    type="submit"
                    style="background-color: #8D8741; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
                    >Agregar</button
                >
            </form>
        </div>
    </div>
{/if}


{/if}

{#if errorMsg != ""}
    <hr>ERROR: {errorMsg}
{:else}
    {#if successMsg != ""}
        <hr>EXITO: {successMsg}
    {/if}
{/if}