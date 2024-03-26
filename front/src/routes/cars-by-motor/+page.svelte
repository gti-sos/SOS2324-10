<script>
    import {onMount} from "svelte";
    
    let API_ASB = "http://localhost:8080/api/v2/cars-by-motor";
    let cars = [];
    let newCar = {geo: "geo", time_period: "0000"};
    let errorMsg = '';

    onMount(()=>{
        getCars();
    })

    async function getCar(){
        console.log(cars);
        try{
            let response = await fetch(API_ASB,{
                                      method: "GET"
            });
            let data = await response.json();
            cars = data;
            console.log(data); 
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
        let status = await response.status;
        console.log(`Creation response status ${status}`);
        }catch(e){
            errorMsg = e;
        }
    }

    async function deleteCars(){
        try{
            let response = await fetch(API_ASB,{
                            method: "DELETE"
                                    });
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
        } catch(e){
            errorMsg = e;
        }
    }

</script>