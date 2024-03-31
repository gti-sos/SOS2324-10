<script>
	import { page } from '$app/stores';
	let API_ASC = '/api/v2/tourisms-per-age';
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';

	if (dev) {
		API_ASC = 'http://localhost:8080' + API_ASC;
	}

	let geo = $page.params.geo;
	let time_period = $page.params.time_period;
	let tourism = {};
	let errMsg = '';
	let exitMsg = '';
	let showForm = false;
	let newData = {};

	onMount(() => {
		getTourism(geo, time_period);
	});

	async function getTourism(geo, time_period) {
		try {
			let response = await fetch(API_ASC + '/' + geo + '/' + time_period, {
				method: 'GET'
			});

			if (response.status == 200) {
				let resp = await response.json();
				tourism = resp;
				exitMsg = 'Dato leido correctamente';
			} else {
				if (response.status == 400) {
					errMsg = 'Error en la estructura de los datos';
				} else if (response.status == 409) {
					errMsg = 'Ya existe una entrada con ese país y año';
				} else if (response.status == 404) {
					errMsg = 'Dato no encontrado';
				}
			}
			console.log('Datos Originales: ' + JSON.stringify(tourism));
		} catch (e) {
			errMsg = e;
		}
	}

	async function putTourism() {
		try {
			let response = await fetch(API_ASC + '/' + geo + '/' + time_period, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(tourism)
			});

			if (response.status == 200) {
				newData = JSON.stringify(tourism);
				showForm = false;
				exitMsg = 'Dato modificado correctamente';
				await getTourism(geo, time_period);
			} else {
				if (response.status == 400) {
					errMsg = 'No se puede cambiar pais ni año';
				} else if (response.status == 409) {
					errMsg = 'Ya existe una entrada con ese país y año';
				} else if (response.status == 404) {
					errMsg = 'Dato no encontrado';
				}
			}
			console.log('Datos Modificados: ' + JSON.stringify(newData));
		} catch (e) {
			errMsg = e;
		}
	}
</script>

<h2>Detalles en {geo}:{time_period}</h2>

{#if !showForm}
	<!-- Vista de detalles del vehículo -->
	{#if Object.keys(tourism).length > 0}
		<div class="container">
			<div class="card">
				<table>
					<tbody>
						{#each Object.entries(tourism) as [key, value]}
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
				<div
					style="text-align:center ;margin-top: 20px; display: flex; justify-content: space-between;"
				>
					<button
						style="background-color: #8bc34a; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
						on:click={() => {
							showForm = true;
						}}
					>
						Modificar Entrada
					</button>
				</div>
			</div>
		</div>
	{:else}
		<p class="container">No hay datos disponibles</p>
	{/if}
{:else}
	<!-- Formulario para modificar la entrada -->
	<div class="container">
		<div class="card">
			<h2 style="color: #673ab7;">Modificar Entrada</h2>
			<form on:submit|preventDefault={putTourism}>
				<table>
					<tbody>
						{#each Object.entries(tourism) as [key, value]}
							<tr>
								<td class="attribute">{key}:</td>
								<td class="value">
									{#if key === 'geo' || key === 'time_period'}
										<input
											type="text"
											bind:value={tourism[key]}
											readonly
											style="background-color: #f3e5f5; border: 1px solid #9c27b0; color: #673ab7;"
										/>
									{:else}
										<input
											type="text"
											bind:value={tourism[key]}
											style="background-color: #f3e5f5; border: 1px solid #9c27b0; color: #673ab7;"
										/>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
				<div style="margin-top: 20px; display: flex; justify-content: space-between;">
					<button
						type="submit"
						style="text-align:center ;background-color: #673ab7; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
						on:submit={() => {
							showForm = false;
							putTourism();
						}}
					>
						Guardar Cambios
					</button>
					<button
						style="background-color: #ef5350; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
						on:click={() => {
							showForm = false;
						}}
					>
						Cancelar
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

{#if errMsg != ''}
	<hr />
	ERROR: {errMsg}
{:else if exitMsg != ''}
	<hr />
	EXITO: {exitMsg}
{/if}

<style>
	.card {
		background-color: #fff;
		border: 1px solid #9c27b0;
		border-radius: 5px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		padding: 20px;
		max-width: 600px;
		margin: 0 auto;
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
		background-color: #f2f2f2;
	}

	tr:nth-child(even) {
		background-color: #f2f2f2;
	}

	tr:hover {
		background-color: #e2e2e2;
	}

	.value {
		width: 50%;
	}

	h2 {
		text-align: center;
	}

	input[type='text'] {
		width: 100%;
		padding: 12px 20px;
		margin: 8px 0;
		box-sizing: border-box;
		border: 1px solid #ccc;
		border-radius: 4px;
		resize: vertical;
	}

	input[type='text']:focus {
		border: 3px solid #555;
	}

	.error {
		color: red;
		font-weight: bold;
	}
</style>
