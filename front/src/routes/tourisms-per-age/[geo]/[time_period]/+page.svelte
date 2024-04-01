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

<div class="container">
	<div class="card">
		<h2 style="color: #673ab7; text-align: center;">Detalles en {geo}:{time_period}</h2>

		{#if !showForm}
			<!-- Vista de detalles del vehículo -->
			{#if Object.keys(tourism).length > 0}
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
				<div style="text-align:center; margin-top: 20px;">
					<button
						style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
						on:click={() => {
							showForm = true;
						}}
					>
						Modificar Entrada
					</button>
				</div>
			{:else}
				<p style="text-align: center;">No hay datos disponibles</p>
			{/if}
		{:else}
			<!-- Formulario para modificar la entrada -->
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
											style="background-color: #f2f2f2; border: 1px solid #ddd; color: #333; padding: 8px; border-radius: 4px; width: 100%;"
										/>
									{:else}
										<input
											type="text"
											bind:value={tourism[key]}
											style="background-color: #f2f2f2; border: 1px solid #ddd; color: #333; padding: 8px; border-radius: 4px; width: 100%;"
										/>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
				<div style="text-align: center; margin-top: 20px;">
					<button
						type="submit"
						style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
					>
						Guardar Cambios
					</button>
					<button
						style="background-color: #f44336; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-left: 20px;"
						on:click={() => {
							showForm = false;
						}}
					>
						Cancelar
					</button>
				</div>
			</form>
		{/if}
	</div>
</div>

{#if errMsg != ''}
	<hr style="border-color: #673ab7; margin-top: 20px; margin-bottom: 20px;" />
	<p style="color: red; text-align: center;">ERROR: {errMsg}</p>
{:else if exitMsg != ''}
	<hr style="border-color: #673ab7; margin-top: 20px; margin-bottom: 20px;" />
	<p style="color: green; text-align: center;">EXITO: {exitMsg}</p>
{/if}

<style>
	body {
		font-family: Arial, sans-serif;
		background-color: #f9f9f9;
	}

	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}

	.card {
		background-color: #fff;
		border-radius: 10px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		padding: 20px;
		max-width: 600px;
		width: 100%;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 20px;
	}

	td {
		padding: 10px;
		border-bottom: 1px solid #ddd;
	}

	.attribute {
		font-weight: bold;
		color: #673ab7;
	}

	.value {
		width: 50%;
	}

	input[type='text'] {
		padding: 8px;
		border: 1px solid #ddd;
		border-radius: 4px;
		width: 100%;
		box-sizing: border-box;
	}

	input[type='text']:focus {
		outline: none;
		border-color: #673ab7;
	}
</style>
