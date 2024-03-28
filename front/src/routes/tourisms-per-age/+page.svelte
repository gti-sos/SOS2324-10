<script>
	import { onMount } from 'svelte';

	let tourisms = [];
	let API_ASC = 'http://localhost:8080/api/v2/tourisms-per-age';
	let newTourism = {
		frequency: '',
		unit: '',
		age: '',
		geo: '',
		time_period: '',
		obs_value: '',
		gdp: '',
		volgdp: ''
	};
	let selectedFilter = {
		frequency: '',
		unit: '',
		age: '',
		geo: '',
		time_period: '',
		obs_value: '',
		gdp: '',
		volgdp: ''
	};
	let selectedTourismIndex = null;
	let showForm = false;
	let errMsg = '';
	let exitMsg = '';

	onMount(() => {
		getTourisms();
	});

	async function getTourisms() {
		console.log(tourisms);
		try {
			let response = await fetch(API_ASC, {
				method: 'GET'
			});
			if (response.ok) {
				let data = await response.json();
				tourisms = data;
				console.log(data);
				errMsg = '';
			} else {
				if (response.status == 404) {
					errMsg = 'No hay datos en la base de datos';
				} else {
					errMsg = `Error ${response.status}: ${response.statusText}`;
				}
			}
		} catch (e) {
			errMsg = e;
		}
	}

	async function createTourism() {
		try {
			await getTourisms();
			let response = await fetch(API_ASC, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newTourism)
			});

			if (response.ok) {
				getTourisms();
				exitMsg = 'Dato creado correctamente';
				showForm = false; // Cerrar el formulario después de crear la entrada
			} else {
				if (response.status == 400) {
					errMsg = 'Todos los datos deben ser introducidos';
				} else if (response.status == 405) {
					errMsg = 'Método no permitido';
				} else if (response.status == 409) {
					errMsg = 'Elemento ya existente';
				}
			}
		} catch (e) {
			errMsg = e;
		}
	}

	async function deleteTourismAll() {
		try {
			let response = await fetch(API_ASC, {
				method: 'DELETE'
			});

			if (response.ok) {
				await getTourisms();
				exitMsg = 'Todos los datos fueron eliminados';
				errMsg = '';
			} else {
				if (response.status == 404) {
					errMsg = 'No existen datos en la base de datos';
				}
			}
		} catch (e) {
			errMsg = e;
		}
	}

	async function deleteTourism(geo, time_period) {
		try {
			let response = await fetch(API_ASC + '/' + geo + '/' + time_period, {
				method: 'DELETE'
			});
			if (response.ok) {
				await getTourisms();

				if (tourisms.length === 0) {
					errMsg = 'No hay datos disponibles';
				}

				exitMsg = 'Dato eliminado correctamente';
				errMsg = '';
			} else {
				if (response.status == 400) {
					errMsg = 'Fallo en el dato';
				} else if (response.status == 404) {
					errMsg = 'Dato no existente en la base de datos';
				} else if (response.status == 409) {
					errMsg = 'Ya existe una entrada con ese país y año';
				}
			}
		} catch (e) {
			errMsg = e;
		}
	}

	function showDetails(index) {
		selectedTourismIndex = index;
	}

	async function updateTourism() {
		try {
			let response = await fetch(
				API_ASC +
					'/' +
					tourisms[selectedTourismIndex].geo +
					'/' +
					tourisms[selectedTourismIndex].time_period,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(tourisms[selectedTourismIndex])
				}
			);
			if (response.ok) {
				await getTourisms();
				exitMsg = 'Dato actualizado correctamente';
				selectedTourismIndex = null; // Cerrar los detalles después de actualizar
			} else {
				errMsg = 'Error al actualizar el dato';
			}
		} catch (e) {
			errMsg = e;
		}
	}
</script>

<!-- Estilo y formato de la tabla -->
{#if tourisms && tourisms.length > 0}<!---->
	<div class="container">
		<table>
			<thead>
				<tr>
					<th>Vista detallada</th>
					{#each Object.keys(tourisms[0]) as key}
						<th>{key}</th>
					{/each}
					<!-- Nueva columna para el botón de eliminar -->
					<th>Eliminar</th>
				</tr>
			</thead>
			<tbody>
				{#each tourisms as dato, index}
					<tr>
						<td>
							<!-- Botón de ver detalles -->
							<button
								style="background-color: #4caf50; color: white; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer;"
								on:click={() => showDetails(index)}>Ver detalles</button
							>
						</td>
						{#each Object.keys(dato) as key}
							<td>
								{#if index === selectedTourismIndex}
									<input
										type="text"
										bind:value={tourisms[index][key]}
										on:change={() => updateTourism()}
									/>
								{:else}
									{dato[key]}
								{/if}
							</td>
						{/each}
						<td>
							<button
								style="background-color: #d32f2f; color: white; padding: 5px 20px; border: none; border-radius: 5px; cursor: pointer;"
								on:click={() => deleteTourism(dato.geo, dato.time_period)}>Eliminar</button
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<!-- Botón para crear entrada -->
		<div style="margin-top: 20px; display: flex; justify-content: space-between;">
			<button
				style="background-color: #6d7fcc; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
				on:click={() => {
					showForm = true;
				}}>Crear Entrada</button
			>
			<button
				style="background-color: #d32f2f; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
				on:click={() => {
					deleteTourismAll();
				}}>Eliminar Todos</button
			>
		</div>
	</div>
	<!---->
	{#if selectedTourismIndex !== null}
		<div class="modal">
			<div class="modal-content">
				<span
					class="close"
					on:click={() => {
						selectedTourismIndex = null;
					}}>&times;</span
				>
				<h2 style="color: #6d7fcc;">Detalles del Turismo</h2>
				<form on:submit|preventDefault={updateTourism}>
					{#each Object.entries(tourisms[selectedTourismIndex]) as [key, value]}
						<label>{key}:</label>
						<input
							type="text"
							bind:value={tourisms[selectedTourismIndex][key]}
							style="margin-bottom: 10px;"
							required
						/>
					{/each}
					<button
						type="submit"
						style="background-color: #6d7fcc; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
						>Actualizar</button
					>
				</form>
			</div>
		</div>
	{/if}

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
				<h2 style="color: #6d7fcc;">Crear Nueva Entrada</h2>
				<form on:submit|preventDefault={createTourism}>
					<label>
						Frequency:
						<input
							type="text"
							bind:value={newTourism.frequency}
							style="margin-bottom: 10px;"
							required
						/>
					</label>
					<label>
						Unit:
						<input type="text" bind:value={newTourism.unit} style="margin-bottom: 10px;" required />
					</label>
					<label>
						Age:
						<input type="text" bind:value={newTourism.age} style="margin-bottom: 10px;" required />
					</label>
					<label>
						Geo:
						<input type="text" bind:value={newTourism.geo} style="margin-bottom: 10px;" required />
					</label>
					<label>
						Time Period:
						<input
							type="text"
							bind:value={newTourism.time_period}
							style="margin-bottom: 10px;"
							required
						/>
					</label>
					<label>
						Obs Value:
						<input
							type="number"
							bind:value={newTourism.obs_value}
							style="margin-bottom: 10px;"
							required
						/>
					</label>
					<label>
						GDP:
						<input
							type="number"
							bind:value={newTourism.gdp}
							style="margin-bottom: 10px;"
							required
						/>
					</label>
					<label>
						Volgdp:
						<input
							type="number"
							bind:value={newTourism.volgdp}
							style="margin-bottom: 10px;"
							required
						/>
					</label>
					<button
						type="submit"
						style="background-color: #6d7fcc; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
						>Crear</button
					>
				</form>
			</div>
		</div>
	{/if}
	{#if errMsg != ''}
		ERROR: {errMsg}
	{/if}
{:else}
	<p class="container">No hay datos disponibles</p>
{/if}

<style>
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
		background-color: #b5b8cf; /* Morado */
	}

	tr:nth-child(even) {
		background-color: #d1d1e0; /* Lavanda */
	}

	tr:hover {
		background-color: #e3e4f1; /* Lila */
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
