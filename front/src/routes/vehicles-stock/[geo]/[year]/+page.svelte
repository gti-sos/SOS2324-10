<script>
	//Librería para obtener recursos de la URL
	import { page } from '$app/stores';
	let API_TLR = '/api/v1/vehicles-stock';
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';

	if (dev) {
		API_TLR = 'http://localhost:8080' + API_TLR;
	}
	let dato = {};
	let errorMsg = '';

	let geo = $page.params.geo;
	let year = $page.params.year;

	onMount(async () => {
		await getVehicle(geo, year);
	});

	//Función para obtener la entrada
	async function getVehicle(geo, year) {
		try {
			let response = await fetch(API_TLR + '/' + geo + '/' + year, {
				method: 'GET'
			});

			if (response.status == 200) {
				let res = await response.json();
				dato = res[0];
			} else {
				errorMsg = 'Código error:' + response.status;
			}

			console.log('Entrada: ' + JSON.stringify(dato));
			console.log('Ruta: ' + API_TLR + '/' + geo + '/' + year);
		} catch (e) {
			errorMsg = e;
		}
	}
</script>

<h2>Vehicle details from {geo}:{year}</h2>

<!-- Vista de detalles del vehículo -->
{#if Object.keys(dato).length > 0}
	<div class="container">
		<div class="card">
			<table>
                <thead>
                    <th>
                        Atributos
                    </th>
                    <th>
                        Valor
                    </th>
                </thead>
				<tbody>
					{#each Object.entries(dato) as [key, value]}
						<tr>
							<td class="attribute">{key}:</td>
							<td class="value">
								{#if typeof value === 'object'}
									{JSON.stringify(value)}
								{:else}
									{value}
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{:else}
	<p class="container">No hay datos disponibles</p>
{/if}

{#if errorMsg}
	<p class="error">ERROR: {errorMsg}</p>
{/if}

<style>
	.card {
		background-color: #ffffff; /* Color de fondo */
		border: 1px solid #a4caef; /* Borde */
		border-radius: 5px; /* Borde redondeado */
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Sombra */
		padding: 20px; /* Espaciado interno */
		max-width: 600px; /* Ancho máximo */
		margin: 0 auto; /* Margen automático a los lados para centrar horizontalmente */
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}
	td {
		border: 1px solid #ddd;
		padding: 8px;
		text-align: left;
	}

	th {
		background-color: #f2f2f2; /* Gris claro */
	}

	tr:nth-child(even) {
		background-color: #f2f2f2; /* Gris claro */
	}

	tr:hover {
		background-color: #e2e2e2; /* Gris más claro */
	}

	.value {
		width: 50%; /* Ancho de la columna de valores */
	}

	/* Estilo para los títulos */
	h2 {
		color: #0366d6; /* Azul */
	}
</style>
