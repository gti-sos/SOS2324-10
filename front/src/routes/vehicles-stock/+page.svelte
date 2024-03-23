<script>
    import {onMount} from "svelte";
    let API_TLR = "http://localhost:8080/api/v1/vehicles-stock";

    onMount(()=>{
        getVehicles();
    })

    async function getVehicles(){
        let response = await fetch(API_TLR,{
            method: "GET"
        });
        let data = await response.json();
        console.log(data);
    }


</script>