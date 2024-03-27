<script>
    import {onMount} from "svelte";

    let tourisms = []
    let API_ASC = "http://localhost:8080/api/v1/tourisms-per-age";

    onMount(()=>{
        getTourisms();
    })

    async function getTourisms(){
        console.log(cars);
        try{
            let response = await fetch(API_ASC,{
                                      method: "GET"
            });
            let data = await response.json();
            tourisms = data;
            console.log(data); 
        } catch(e){
            errorMsg = e;
        }
        
    }

    async function createTourism(){
        try{
            let response = await fetch(API_ASC,{
                                      method: "POST",
                                      headers: {
                                        "Content-Type": "application/json"
                                      },
                                      body: JSON.stringify(newTourism)
                                    });

        let status = await response.status;
        console.log(`Creation response status ${status}`);
        }catch(e){
            errorMsg = e;
        }
        

    }

    async function deleteTourismAll(){

        try{
            let response = await fetch(API_ASC,{
                                    method: "DELETE"
                        });
        } catch(e){
            errorMsg = e;
        }

    }

    async function deleteTourism(n){

        console.log(`Deleting contact with name ${n}`); 

        try{
            let response = await fetch(API_ASC+"/"+n,{
                                      method: "DELETE"
                        });
        } catch(e){
            errorMsg = e;
        }
        
    }

</script>