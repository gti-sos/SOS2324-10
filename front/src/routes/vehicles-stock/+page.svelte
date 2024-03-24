<!--Funciones para la tabla-->
<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/enviroment';

	let API_TLR = '/api/v1/vehicles-stock';

    if(dev){
        API_TLR = "http://localhost:8080" + API_TLR
    }
	let datos = [];
	let errorMsg = '';
	let showForm = false;
	let newDato = {
		freq: '',
		vehicle: '',
		unit: '',
		geo: '',
		year: '',
		obs_value: '',
		flights_passangers: '',
		cars_deaths: ''
	};

	onMount(async () => {
		await getVehicles();
	});

	//Get lista
	async function getVehicles() {
		try {
			let response = await fetch(API_TLR + '?limit=-1', {
				method: 'GET'
			});
			let data = await response.json();
			datos = data;
			console.log(data);
		} catch (e) {
			errorMsg = e;
		}
	}

	//Post objesto
	async function postVehicle() {
		try {
			let response = await fetch(API_TLR, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newDato)
			});

			let status = response.status;
			console.log(`Creation response status ${status}`);

			if (status === 201) {
				getVehicles();
				showForm = false;
			} else {
				let data = await response.json();
				throw new Error(`Objeto no creado, error: ${status}, Objeto: ${JSON.stringify(newDato)}`);
			}
		} catch (error) {
			errorMsg = error.message;
			console.error(error);
		}
	}

	//Delete Objeto
	async function deleteVehicle(geo, year) {
		try {
			let response = await fetch(API_TLR + '/' + geo + '/' + year, {
				method: 'DELETE'
			});

			if (response.status == 200) {
				getVehicles();
			} else {
				errorMsg = 'Código error:' + response.status;
			}
		} catch (error) {
			errorMsg = error;
		}
	}
</script>

<!--Estilo y formato de la tabla-->
{#if datos && datos.length > 0}
	<div class="container">
		<table>
			<thead>
				<tr>
					{#each Object.keys(datos[0]) as key}
						<th>{key}</th>
					{/each}
					<!-- Nueva columna para el botón de eliminar -->
					<th>Eliminar dato</th>
				</tr>
			</thead>
			<tbody>
				{#each datos as dato}
					<tr>
						{#each Object.values(dato) as value}
							<td>{value}</td>
						{/each}
						<!-- Botón de eliminar -->
						<td>
							<button
								style="background-color: #0366d6; color: white; padding: 5px 20px; border: none; border-radius: 5px; cursor: pointer;"
								on:click={() => deleteVehicle(dato.geo, dato.year)}>Eliminar</button
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<!--Botón para crear entrada-->
		<div style="text-align: right; margin-top: 20px;">
			<button
				style="background-color: #0366d6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
				on:click={() => {
					showForm = true;
				}}>Crear Entrada</button
			>
		</div>
	</div>

	<!-- Popup para crear nuevo objeto -->
	{#if showForm}
		<div class="modal">
			<div class="modal-content">
				<span
					class="close"
					on:click={() => {
						showForm = false;
					}}>&times;</span
				>
				<h2 style="color: #0366d6;">Crear Nueva Entrada</h2>
				<form on:submit|preventDefault={postVehicle}>
					<label>
						Freq:
						<input type="text" bind:value={newDato.freq} style="margin-bottom: 10px;" />
					</label>
					<label>
						Vehicle:
						<input type="text" bind:value={newDato.vehicle} style="margin-bottom: 10px;" />
					</label>
					<label>
						Unit:
						<input type="text" bind:value={newDato.unit} style="margin-bottom: 10px;" />
					</label>
					<label>
						Geo:
						<input type="text" bind:value={newDato.geo} style="margin-bottom: 10px;" />
					</label>
					<label>
						Year:
						<input type="number" bind:value={newDato.year} style="margin-bottom: 10px;" />
					</label>
					<label>
						Obs Value:
						<input type="number" bind:value={newDato.obs_value} style="margin-bottom: 10px;" />
					</label>
					<label>
						Flights Passangers:
						<input
							type="number"
							bind:value={newDato.flights_passangers}
							style="margin-bottom: 10px;"
						/>
					</label>
					<label>
						Cars Deaths:
						<input type="number" bind:value={newDato.cars_deaths} style="margin-bottom: 10px;" />
					</label>
					<button
						type="submit"
						style="background-color: #0366d6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
						>Crear</button
					>
				</form>
			</div>
		</div>
	{/if}

	{#if errorMsg != ''}
		ERROR: {errorMsg}
	{/if}
{:else}
	<p class="container">No hay datos disponibles</p>
{/if}

<style>
	body {
		font-family: Arial, sans-serif;
		line-height: 1.6;
		margin: 0;
		padding: 0;
		background-color: #f3f7ff; /* Azul claro */
		color: #333;
	}

	.container {
		width: 80%;
		margin: 50px auto;
		background-color: #ffffff; /* Blanco */
		border: 1px solid #a4caef; /* Azul claro */
		border-radius: 5px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		padding: 20px;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th,
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

	/* Estilos para el popup */
	.modal {
		display: block; /* Muestra el popup */
		position: fixed;
		z-index: 1;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: auto;
		background-color: rgba(0, 0, 0, 0.4); /* Fondo oscuro */
	}

	.modal-content {
		background-color: #fefefe; /* Color de fondo */
		margin: 15% auto; /* Centrar el popup verticalmente */
		padding: 20px;
		border: 1px solid #888;
		width: 50%;
		border-radius: 5px;
		box-shadow:
			0 4px 8px 0 rgba(0, 0, 0, 0.2),
			0 6px 20px 0 rgba(0, 0, 0, 0.19);
	}

	/* Botón de cerrar (x) del popup */
	.close {
		color: #aaa;
		float: right;
		font-size: 28px;
		font-weight: bold;
	}

	.close:hover,
	.close:focus {
		color: black;
		text-decoration: none;
		cursor: pointer;
	}

	/* Estilos para los inputs del formulario */
	input[type='text'],
	input[type='number'] {
		width: 100%;
		padding: 12px 20px;
		margin: 8px 0;
		box-sizing: border-box;
		border: 1px solid #ccc;
		border-radius: 4px;
		resize: vertical;
	}

	input[type='text']:focus,
	input[type='number']:focus {
		border: 3px solid #555;
	}
</style>
