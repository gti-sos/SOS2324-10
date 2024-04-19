<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let API_ASC = '/api/v2/tourisms-per-age';

	if (dev) {
		API_ASC = 'http://localhost:8080' + API_ASC;
	}

	let tourisms = [];
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
	let filters = {
		frequency: '',
		unit: '',
		age: '',
		geo: '',
		time_period: '',
		obs_value: '',
		gdp: '',
		volgdp: ''
	};
	let showFilter = false;
	let showForm = false;
	let errMsg = '';
	let exitMsg = '';

	let currentPage = 1;
	let totalItems = 0;
	let pageSize = 10;

	onMount(async () => {
		await getTourisms();
		await getTourismsTotal();
	});

	async function loadInitialData() {
		try {
			if (tourisms.length === 0) {
				let response = await fetch(API_ASC + '/loadInitialData', {
					method: 'GET'
				});

				if (response.ok) {
					getTourisms();
					exitMsg = 'Datos Cargados Correctamente';
				} else {
					errMsg = 'La base de datos no está vacía';
				}
			} else {
				errMsg = 'La base de datos no está vacía';
			}
		} catch (error) {
			errMsg = error;
		}
	}

	async function getTourisms() {
		// await getTourismsTotal();
		try {
			let offset = (currentPage - 1) * pageSize;
			let response = await fetch(`${API_ASC}?limit=${pageSize}&offset=${offset}`, {
				method: 'GET',
			});
			if (response.ok) {
				let data = await response.json();
				tourisms = data;
				console.log(data);
				//totalItems = data.length;
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

			if (response.status == 201) {
				showForm = false; // Cerrar el formulario después de crear la entrada
				await getTourisms();
				exitMsg = 'Dato creado correctamente';
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
	async function getTourismsTotal() {
		try {
			let response = await fetch(API_ASC + '?limit=100', {
				method: 'GET'
			});
			let data = await response.json();
			totalItems = data.length;
		} catch (e) {
			errMsg = e;
		}
	}

	function goToPageAnt() {
		if (currentPage > 1) {
            currentPage--;
            getTourisms();
        }
	}

	function goToPageSig() {
		console.log(currentPage);
		if ((currentPage * pageSize) < totalItems) {
            currentPage++;
            getTourisms();
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
				tourisms = [];
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

	async function searchListings() {
		try {
			// Construye la URL de búsqueda a partir de los filtros proporcionados
			let searchParams = new URLSearchParams();
			for (const key in filters) {
				if (filters[key] !== '') {
					searchParams.append(key, filters[key]);
				}
			}
			let searchUrl = `${API_ASC}?${searchParams.toString()}`;
			console.log(searchUrl);
			// Realiza la petición GET a la API con la URL de búsqueda generada
			let response = await fetch(searchUrl, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			// Manejo de la respuesta de la API
			let status = response.status;
			console.log(`Response status: ${status}`);

			if (response.ok) {
				// Actualiza los datos después de una búsqueda exitosa
				exitMsg = 'Mostrando los datos solicitados';
				showFilter = false;
				let data = await response.json();
				tourisms = data;
				console.log(data);
			} else {
				// Manejo de errores
				if (response.status == 404) {
					errMsg = 'No se encontraron datos';
				} else {
					errMsg = `Error ${response.status}: ${response.statusText}`;
				}
			}
		} catch (error) {
			errMsg = error;
			console.log(error);
		}
	}

	// function showDetails(index) {
	// 	selectedTourismIndex = index;
	// }

	// async function updateTourism() {
	// 	try {
	// 		let response = await fetch(
	// 			API_ASC +
	// 				'/' +
	// 				tourisms[selectedTourismIndex].geo +
	// 				'/' +
	// 				tourisms[selectedTourismIndex].time_period,
	// 			{
	// 				method: 'PUT',
	// 				headers: {
	// 					'Content-Type': 'application/json'
	// 				},
	// 				body: JSON.stringify(tourisms[selectedTourismIndex])
	// 			}
	// 		);
	// 		if (response.ok) {
	// 			await getTourisms();
	// 			exitMsg = 'Dato actualizado correctamente';
	// 			selectedTourismIndex = null; // Cerrar los detalles después de actualizar
	// 		} else {
	// 			errMsg = 'Error al actualizar el dato';
	// 		}
	// 	} catch (e) {
	// 		errMsg = e;
	// 	}
	// }
</script>

<title> tourisms-per-age </title>

<!-- Estilo y formato de la tabla -->
{#if tourisms && tourisms.length > 0}<!---->
	<div class="container">
		<div style="margin-bottom: 20px; display: flex; justify-content: space-between;">
			<button on:click={() => goToPageAnt()}>Anterior</button>
			<span>Página {currentPage}</span>
			<button on:click={() => goToPageSig()}>Siguiente</button>
		</div>
		<table>
			<thead>
				<tr>
					<!-- <th>id</th> -->
					<!-- Aquí colocamos primero la columna del ID -->
					{#each Object.keys(tourisms[0]) as key}
						{#if key !== 'id'}
							<!-- Evitamos mostrar la columna ID nuevamente -->
							<th>{key}</th>
						{/if}
					{/each}
					<th>vista</th>
					<!-- Nueva columna para el botón de eliminar -->
					<th>eliminar</th>
				</tr>
			</thead>
			<tbody>
				{#each tourisms as dato}
					<tr class="prueba">
						<!-- <td>{dato.id}</td> -->
						{#each Object.entries(dato) as [key, value]}
							<!-- Usamos Object.entries para mantener el orden de las propiedades -->
							{#if key !== 'id'}
								<!-- Evitamos mostrar la columna ID nuevamente -->
								<td>{value}</td>
							{/if}
						{/each}
						<!-- {#each Object.keys(dato) as key}
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
						{/each} -->
						<td>
							<!-- Botón de ver detalles -->
							<a
								href="/tourisms-per-age/{dato.geo}/{dato.time_period}"
								style="text-decoration: none; background-color: #4CAF50; color: white; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer; display: inline-block;"
							>
								Detalles
							</a>
						</td>
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
				}}>Crear Turismo</button
			>
			<button
				style="background-color: #d32f2f; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
				id="deleteAllButton"
				on:click={() => {
					deleteTourismAll();
				}}>Eliminar Todos</button
			>
			<button
				style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
				on:click={() => {
					showFilter = true;
				}}>Búsqueda Filtrada</button
			>
		</div>
	</div>
	<!---->
	<!-- {#if selectedTourismIndex !== null}
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
	{/if} -->

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
							type="number"
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
	{#if showFilter}
		<div class="modal">
			<div class="modal-content">
				<span
					class="close"
					on:click={() => {
						showFilter = false;
					}}>&times;</span
				>
				<h2 style="color: #6d7fcc;">Búsqueda Filtrada</h2>
				<form on:submit|preventDefault={searchListings}>
					<label>
						Frequency:
						<input type="text" bind:value={filters.frequency} style="margin-bottom: 10px;" />
					</label>
					<label>
						Unit:
						<input type="text" bind:value={filters.unit} style="margin-bottom: 10px;" />
					</label>
					<label>
						Age:
						<input type="text" bind:value={filters.age} style="margin-bottom: 10px;" />
					</label>
					<label>
						Geo:
						<input type="text" bind:value={filters.geo} style="margin-bottom: 10px;" />
					</label>
					<label>
						Time Period:
						<input type="number" bind:value={filters.time_period} style="margin-bottom: 10px;" />
					</label>
					<label>
						Obs Value:
						<input type="number" bind:value={filters.obs_value} style="margin-bottom: 10px;" />
					</label>
					<label>
						GDP:
						<input type="number" bind:value={filters.gdp} style="margin-bottom: 10px;" />
					</label>
					<label>
						Volgdp:
						<input type="number" bind:value={filters.volgdp} style="margin-bottom: 10px;" />
					</label>
					<button
						type="submit"
						style="background-color: #6d7fcc; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
						>Buscar</button
					>
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
{:else}
	<button
		style="background-color: #0366d6; color: white; padding: 5px 20px; border: none; border-radius: 5px; cursor: pointer;"
		on:click={() => loadInitialData()}
	>
		Cargar datos
	</button>
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
