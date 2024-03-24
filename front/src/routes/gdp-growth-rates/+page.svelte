<script>
    import {onMount} from "svelte";

    let API_MRF = "http://localhost:8080/api/v2/gdp-growth-rates";
    let gdp = [];
    let newGdp = {geo: "geo", time_period: "0000"};
    let errorMsg = '';

    onMount(()=>{
        getGDP();
    })

    async function getGDP(){
        console.log(gdp);
        try{
            let response = await fetch(API_MRF,{
                                      method: "GET"
            });
            let data = await response.json();
            gdp = data;
            console.log(data); 
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

        let status = await response.status;
        console.log(`Creation response status ${status}`);
        /**if(status == 201)
            getGDP();
        else
            errorMsg = "code: " + status */
        }catch(e){
            errorMsg = e;
        }
        

    }

    async function deleteGDPAll(){

        try{
            let response = await fetch(API_MRF,{
                                    method: "DELETE"
                        });
            
        /**if(response.status == 200)
                getGDP();
            else
                errorMsg = "code: " + response.status */ 
        } catch(e){
            errorMsg = e;
        }

    }

    async function deleteGDP(n){

        console.log(`Deleting contact with name ${n}`); 

        try{
            let response = await fetch(API_MRF+"/"+n,{
                                      method: "DELETE"
                        });
            
           /**if(response.status == 200)
                getGDP();
            else
                errorMsg = "code: " + response.status */ 
        } catch(e){
            errorMsg = e;
        }
        
    }



</script>

<table>
    <thead>
        <tr>
            <th>
                geo
            </th>
            <th>
                time_period
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
        <li>{g.geo} - {g.time_period} <button on:click="{deleteGDP(g.geo)}"> Delete </button></li>
    {/each}
</ul>

<button on:click="{createGDP}"> Create </button>
<button on:click="{deleteGDPAll}"> Delete </button>
{#if errorMsg != ""}
<hr>ERROR: {errorMsg}
{/if}