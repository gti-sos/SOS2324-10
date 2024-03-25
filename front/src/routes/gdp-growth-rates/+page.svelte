<script>
    import {onMount} from "svelte";
    import { dev } from "$app/environment";
    import { Button, Col, Row, Table, Input } from '@sveltestrap/sveltestrap';


    let API_MRF = "/api/v2/gdp-growth-rates";
    if(dev)
        API_MRF = "http://localhost:8080" + API_MRF;

    let gdp = [];
    let newGdp = {geo: "", time_period: "", dataflow: "", last_update: "",
            frequency: "", unit: "", na_item: "", obs_value: "", growth_rate_2030: "",
            growth_rate_2040: ""};
    let errorMsg = '';

    onMount(async ()=>{
       await getGDP();
    })

    async function getInitialGDP(){
        try{
            let response = await fetch(API_MRF+"/loadInitialData",{
                                      method: "GET"
            });
            if(response.ok){
               getGDP();
               errorMsg = "Datos cargados correctamente";
            } else {
                errorMsg = "Ya existen datos en la base de datos";
            }
        } catch(e){
            errorMsg = e;
        }
        
    }

  
    async function getGDP(){
        try{
            let response = await fetch(API_MRF+"?limit=100",{
                                      method: "GET"
            });
            if(response.ok){
                let data = await response.json();
                gdp = data;
                console.log(data);
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
            getGDP();
            errorMsg = "Dato creado correctamente";
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
                errorMsg = "Todos los datos fueron eliminados"
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
                errorMsg = "Dato eliminado correctamente";
            } else {
                if(response.status == 400){
                    errorMsg = "Fallo en el dato"
                } else if(response.status == 404){
                    errorMsg = "Dato no existente en la base de datos"
                }
            } 
          
        } catch(e){
            errorMsg = e;
        }
     
    }



</script>


<Row>
    <Col>
        <Table>
            <thead>
                <tr>
                    <th>Geo</th>
                    <th>Time Period</th>
                    <th>Dataflow</th>
                    <th>Last Update</th>
                    <th>Frequency</th>
                    <th>Unit</th>
                    <th>NA Item</th>
                    <th>Obs Value</th>
                    <th>Growth Rate 2030</th>
                    <th>Growth Rate 2040</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><Input bind:value={newGdp.geo} /></td>
                    <td><Input bind:value={newGdp.time_period} type="number" /></td>
                    <td><Input bind:value={newGdp.dataflow} /></td>
                    <td><Input bind:value={newGdp.last_update} /></td>
                    <td><Input bind:value={newGdp.frequency} /></td>
                    <td><Input bind:value={newGdp.unit} /></td>
                    <td><Input bind:value={newGdp.na_item} /></td>
                    <td><Input bind:value={newGdp.obs_value} type="number" step="0.01" /></td>
                    <td><Input bind:value={newGdp.growth_rate_2030} type="number" /></td>
                    <td><Input bind:value={newGdp.growth_rate_2040} type="number" /></td>
                </tr>
            </tbody>
        </Table>
        <Button color="primary" on:click={createGDP}>Agregar Nuevo Dato</Button>
    </Col>
</Row>


<Row>
    <Col>
        <div class="table-responsive">
            <Table class="table-striped">
                <thead>
                    <tr>
                        <th>Geo</th>
                        <th>Time Period</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {#if gdp.length === 0}
                        <tr>
                            <td colspan="3" class="text-center">No hay datos disponibles</td>
                        </tr>
                    {:else}
                        {#each gdp as g}
                            <tr>
                                <td><a href="/gdp-growth-rates/{g.geo}/{g.time_period}">{g.geo}</a></td>
                                <td>{g.time_period}</td>
                                <td>
                                    <Button color="danger" on:click={() => deleteGDP(g.geo, g.time_period)}>Borrar entrada</Button>
                                </td>
                            </tr>
                        {/each}
                    {/if}
                </tbody>
            </Table>
        </div>
    </Col>
</Row>

<button on:click="{deleteGDPAll}"> Borrar todos los datos </button>
<button on:click="{getInitialGDP}"> Datos de prueba </button>

{#if errorMsg != ""}
<hr>ERROR: {errorMsg}
{/if}
