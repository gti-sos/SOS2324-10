<script>
    import {onMount} from "svelte";
    
    let API_ASB = "http://localhost:8080/api/v2/cars-by-motor";
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
            showForm = false;
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

    async function deleteCar(n){
        console.log(`Deleting car ${n}`); 
        try{
            let response = await fetch(API_ASB+"/"+n,{
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

{#if errorMsg != ""}
    <hr>ERROR: {errorMsg}
{:else}
    {#if exitoMsg != ""}
        <hr>EXITO: {exitoMsg}
    {/if}
{/if}