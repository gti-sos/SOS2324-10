<script>
    import {onMount} from "svelte";
    import { dev } from "$app/environment";
    import { Button, Col, Row, Table, Input } from '@sveltestrap/sveltestrap';


    let API_MRF = "/api/v2/gdp-growth-rates";
    if(dev)
        API_MRF = "http://localhost:8080" + API_MRF;

    let gdp = [];
    let newGdp = {geo: "geo", time_period: "0000"};
    let errorMsg = '';

    onMount(()=>{
        getInitialGDP();
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
            let response = await fetch(API_MRF+"/",{
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
                getGDP();
                errorMsg = "Todos los datos fueron eliminados"
            }else{
                if(reponse.status == 404){
                    errorMsg = "No existen datos en l a base de datos";
                }
                
            }
        } catch(e){
            errorMsg = e;
        }

    }

    async function deleteGDP(n){

        try{
            let response = await fetch(API_MRF+"/"+n,{
                                      method: "DELETE"
                        });
            if(response.ok){
                getGDP();
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


<table>
    <thead>
        <tr>
            <th>
                País
            </th>
            <th>
                Año
            </th>
        </tr>
    </thead>
    <tbody>
        <tr> 
            <td>
                <input bind:value={newGdp.geo}>
            </td>
            <td>
                <input bind:value={newGdp.time_period}>
            </td>
        </tr>
    </tbody>
    
</table>

<ul>
    {#each gdp as g}
        <li><a href="/gdp-growth-rates/{g.geo}">{g.geo}</a> - {g.time_period} <button on:click="{deleteGDP(g.geo)}"> Borrar entrada </button></li>
    {/each}
</ul>

<button on:click="{createGDP}"> Crear nueva entrada </button>
<button on:click="{deleteGDPAll}"> Borrar todos los datos </button>
<button on:click="{getInitialGDP}"> Datos de prueba </button>

{#if errorMsg != ""}
<hr>ERROR: {errorMsg}
{/if}