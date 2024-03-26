<script>
    import {onMount} from "svelte";
    import { dev } from "$app/environment";
    import { Styles, Button, Col, Row, Table, Input } from '@sveltestrap/sveltestrap';


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
            let response = await fetch(API_MRF,{
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
                } else if (response.status == 409) {
                    errorMsg = 'Ya existe una entrada con ese país y año';
                }
            } 
          
        } catch(e){
            errorMsg = e;
        }
     
    }



</script>
{#if gdp.length > 0}

<Table class="table-striped">
    <thead>
        <tr>
            <th class="text-center">Column</th>
            <th class="text-center">Geo</th>
            <th class="text-center">Time Period</th>
            <th class="text-center">Frequency</th>
            <th class="text-center">Unit</th>
            <th class="text-center">NA Item</th>
            <th class="text-center">Obs Value</th>
            <th class="text-center">Growth Rate 2030</th>
            <th class="text-center">Growth Rate 2040</th>
            <th class="text-center">Acciones</th>
        </tr>
    </thead>
    <tbody>
        {#each gdp as g, index}
        <tr>
            <td class="text-center">{index + 1}</td>
            <td class="text-center"><a href="/gdp-growth-rates/{g.geo}/{g.time_period}">{g.geo}</a></td>
            <td class="text-center">{g.time_period}</td>
            <td class="text-center">{g.frequency}</td>
            <td class="text-center">{g.unit}</td>
            <td class="text-center">{g.na_item}</td>
            <td class="text-center">{g.obs_value}</td>
            <td class="text-center">{g.growth_rate_2030}</td>
            <td class="text-center">{g.growth_rate_2040}</td>
            <td class="text-center">
                <button class="btn btn-danger" on:click={() => deleteGDP(g.geo, g.time_period)}>Borrar dato</button>
            </td>
        </tr>
        {/each}
    </tbody>
</Table>
{/if}


                          

<button on:click="{deleteGDPAll}"> Borrar todos los datos </button>
<button on:click="{getInitialGDP}"> Datos de prueba </button>

{#if errorMsg != ""}
<hr>ERROR: {errorMsg}
{/if}
