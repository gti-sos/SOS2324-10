<script>

    import { page } from '$app/stores'; 
    import { dev } from "$app/environment";
    import { onMount } from 'svelte';
    import { Button, Col, Row, Input } from '@sveltestrap/sveltestrap';


    let API_MRF = "/api/v2/gdp-growth-rates";
    if(dev)
        API_MRF = "http://localhost:8080" + API_MRF;
    let errorMsg = '';
    let geo = $page.params.geo;
    let time_period = $page.params.time_period;
    let formData = {
        frequency: '',
        unit: '',
        na_item: '',
        time_period: 0,
        obs_value: 0,
        growth_rate_2030: 0,
        growth_rate_2040: 0
    };

    onMount(fetchGeoDetails);

    async function fetchGeoDetails() {
        try {
            const response = await fetch(API_MRF+`/${geo}/${time_period}`,{
                                        method: "GET"
                                        
            }); 

            const data = await response.json();
            formData = { ...data }; // Copiar los datos obtenidos en el formulario
        } catch (error) {
            console.error('Error al obtener los detalles de la geo:', error);
        }
    }

    async function updateGeoDetails() {
        try {
            const response = await fetch(API_MRF+`/${geo}/${time_period}`,{
                                        method: "PUT",
                                        headers: {
                                        "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(formData)
                                         }); 
            if(response.ok){
                errorMsg = "Dato actualizado correctamente"
                window.location.href = API_MRF;
            }else if(!response.ok) {
                if(response.status == 400){
                    errorMsg = "Todos los campos deben ser rellenados";
                } else if(response.status == 405) {
                    errorMsg = "Método no permitido";
                }
            }
        } catch (error) {
            console.error('Error al actualizar los detalles de la geo:', error);
        }
    }
</script>

<h1>Modificar datos de {geo}</h1>

<Row>
    <Col md="6">
        <Input label="Frecuencia" bind:value="{formData.frequency}" placeholder="Ingrese la frecuencia" />
    </Col>
    <Col md="6">
        <Input label="Unidad" bind:value="{formData.unit}" placeholder="Ingrese la unidad" />
    </Col>
</Row>
<Row>
    <Col md="6">
        <Input label="PIB" bind:value="{formData.na_item}" placeholder="Ingrese el PIB" />
    </Col>
    <Col md="6">
        <Input label="País" bind:value="{formData.geo}" placeholder="Ingrese el país" />
    </Col>
</Row>
<Row>
    <Col md="6">
        <Input type="number" label="Año" bind:value="{formData.time_period}" placeholder="Ingrese el año" />
    </Col>
    <Col md="6">
        <Input type="number" step="0.01" label="Porcentaje de incremento" bind:value="{formData.obs_value}" placeholder="Ingrese el porcentaje de incremento" />
    </Col>
</Row>
<Row>
    <Col md="6">
        <Input type="number" label="Previsión 2030" bind:value="{formData.growth_rate_2030}" placeholder="Ingrese la previsión para 2030" />
    </Col>
    <Col md="6">
        <Input type="number" label="Previsión 2040" bind:value="{formData.growth_rate_2040}" placeholder="Ingrese la previsión para 2040" />
    </Col>
</Row>
<Button color="primary" on:click="{updateGeoDetails}">Guardar cambios</Button>




{#if errorMsg != ""}
<hr>ERROR: {errorMsg}
{/if}