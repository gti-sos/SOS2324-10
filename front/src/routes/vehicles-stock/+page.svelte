<!--Funciones para la tabla-->
<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let API_TLR = '/api/v2/vehicles-stock';

	if (dev) {
		API_TLR = 'http://localhost:8080' + API_TLR;
	}
	let datos = [];
	let errorMsg = '';
	let showForm = false;
	let showFilter = false;
	let page = 1;
	let totalPages = 1;
	let totalDatos = 0;
	let pageSize = 10;
	let selectedFilter = {
		freq: '',
		vehicle: '',
		unit: '',
		geo: '',
		year: '',
		obs_value: '',
		flights_passangers: '',
		cars_deaths: ''
	};
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
		await getVehiclesTotal();
	});

	//Datos Iniciales
	async function getInitialData() {
		try {
			if (datos.length === 0) {
				let response = await fetch(API_TLR + '/loadInitialData', {
					method: 'GET'
				});

				if (response.ok) {
					getVehicles();
					alert('Datos Cargados Correctamente');
				} else {
					errorMsg = 'La base de datos no está vacía';
				}
			} else {
				errorMsg = 'La base de datos no está vacía';
			}
		} catch (error) {
			errorMsg = error;
		}
	}

	//Función filtro
	async function getVehiclesFilter() {
		try {
			// Construye la URL de búsqueda a partir de los filtros proporcionados
			let searchParams = new URLSearchParams();
			if (selectedFilter.length == 0) {
				selectedFilter = {
					freq: '',
					vehicle: '',
					unit: '',
					geo: '',
					year: '',
					obs_value: '',
					flights_passangers: '',
					cars_deaths: ''
				};
			}
			for (const key in selectedFilter) {
				if (selectedFilter[key] !== '') {
					searchParams.append(key, selectedFilter[key]);
				}
			}
			let searchUrl =
				`${API_TLR}/search?${searchParams.toString()}` +
				`&limit=${pageSize}&offset=${(page - 1) * pageSize}`;
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

			if (response.status == 200) {
				// Actualiza los datos después de una búsqueda exitosa
				let data = await response.json();
				datos = data;
				console.log(data);
			} else {
				// Manejo de errores
				if (response.status == 400) {
					errorMsg = 'Error en la estructura de los datos';
					alert(errorMsg);
				} else if (response.status == 409) {
					errorMsg = 'Ya existe una entrada con ese país y año';
					alert(errorMsg);
				} else if (response.status == 404) {
					errorMsg = 'Dato no encontrado';
					alert(errorMsg);
				}
			}
		} catch (error) {
			errorMsg = error;
			console.error(error);
		}
	}

	//Get Vehicles total
	async function getVehiclesTotal() {
		try {
			let response = await fetch(API_TLR + '?limit=100', {
				method: 'GET'
			});
			let dataT = await response.json();
			totalDatos = dataT.length;
			console.log('DATOOS TODOS: ' + dataT);
			console.log('URL: ' + API_TLR);
			console.log('datos totales: ' + totalDatos);
			totalPages = Math.ceil(totalDatos / 10); // Calcular el número total de páginas
			console.log('Total páginas: ' + totalPages);
		} catch (e) {
			errorMsg = e;
		}
	}


	async function getVehicles() {
		await getVehiclesTotal();

		try {
			let offset = (page - 1) * pageSize;
			let response = await fetch(`${API_TLR}?limit=${pageSize}&offset=${offset}`, {
				method: 'GET',
				headers: {
					'Cache-Control': 'no-cache',
					Pragma: 'no-cache'
				}
			});
			if (response.ok) {
				let data = await response.json();
				datos = data;
				console.log(data);
			} else {
				if (response.status == 404) {
					errorMsg = 'No hay datos en la base de datos';
				} else {
					errorMsg = `Error ${response.status}: ${response.statusText}`;
				}
			}
		} catch (e) {
			errorMsg = e;
		}
	}

	// Función para ir a la página anterior
	function goToPreviousPage() {
		getVehiclesTotal();
		if (page > 1) {
			page --;
			getVehicles();
		}
	}

	// Función para ir a la página siguiente
	function goToNextPage() {
		if ((page * pageSize) <= totalDatos) {
			page ++;
			getVehicles();
		}
	}

	//Función eliminar filtrosd
	function limpiarFiltros() {
		selectedFilter = {
			freq: '',
			vehicle: '',
			unit: '',
			geo: '',
			year: '',
			obs_value: '',
			flights_passangers: '',
			cars_deaths: ''
		};
		showFilter = false;
		getVehiclesFilter();
	}

	//Post objeto
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

			if (response.status == 201) {
				showForm = false;
				await getVehicles(); // Actualizar los datos después de la creación exitosa
				alert('Entrada creada correctamente');
			} else {
				if (response.status == 400) {
					errorMsg = 'Error en la estructura de los datos';
					alert(errorMsg);
				} else if (response.status == 409) {
					errorMsg = 'Ya existe una entrada con ese país y año';
					alert(errorMsg);
				} else if (response.status == 404) {
					errorMsg = 'Dato no encontrado';
					alert(errorMsg);
				}
			}
		} catch (error) {
			errorMsg = error;
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
				alert('Entrada eliminada. ' + geo + ':' + year);
				await getVehicles();
			} else {
				if (response.status == 400) {
					errorMsg = 'Error en la estructura de los datos';
					alert(errorMsg);
				} else if (response.status == 409) {
					errorMsg = 'Ya existe una entrada con ese país y año';
					alert(errorMsg);
				} else if (response.status == 404) {
					errorMsg = 'Dato no encontrado';
					alert(errorMsg);
				}
			}
		} catch (error) {
			errorMsg = error;
		}
	}

	//Delete ALL
	async function deleteALL() {
		try {
			let response = await fetch(API_TLR, {
				method: 'DELETE'
			});
			if (response.status == 200) {
				alert('Todas las entradas han sido eliminadas');
				getVehicles();
			} else {
				if (response.status == 400) {
					errorMsg = 'Error en la estructura de los datos';
					alert(errorMsg);
				} else if (response.status == 409) {
					errorMsg = 'Ya existe una entrada con ese país y año';
					alert(errorMsg);
				} else if (response.status == 404) {
					errorMsg = 'Dato no encontrado';
					alert(errorMsg);
				}
			}
		} catch (error) {
			errorMsg = error;
			
		}
	}
</script>


<body>
	<!--Estilo y formato de la tabla-->
	<title> vehicles-stock</title>
	{#if datos && datos.length > 0}<!---->
		<div class="container">
			<div style="margin-bottom: 20px; display: flex; justify-content: space-between;">
				<button
					style="background-color: #0366d6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
					on:click={() => {
						showFilter = true;
					}}
					>Filtros
				</button>
			</div>
			<table>
				<thead>
					<tr>
						<th>Vista detallada</th>
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
							<td>
								<!-- Botón de eliminar -->
								<a
									href="/vehicles-stock/{dato.geo}/{dato.year}"
									style="text-decoration: none; background-color: #666666; color: white; padding: 5px 10px; border-radius: 5px; cursor: pointer; display: inline-block;"
								>
									Ver detalles
								</a>
							</td>
							{#each Object.values(dato) as value}
								<td>{value}</td>
							{/each}
							<!---->
							<td>
								<button
									style="background-color: #FF0000; color: white; padding: 5px 20px; border: none; border-radius: 5px; cursor: pointer;"
									on:click={() => deleteVehicle(dato.geo, dato.year)}
									>Eliminar
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
			<div style="margin-top: 20px; display: flex; justify-content: space-between;">
				<button
					style="background-color: #0366d6; color: white; padding: 5px 20px; border: none; border-radius: 5px; cursor: pointer;"
					on:click={() => goToPreviousPage()}
					>Anterior
				</button>
				<button
					style="background-color: #0366d6; color: white; padding: 5px 20px; border: none; border-radius: 5px; cursor: pointer;"
					on:click={() => goToNextPage()}
				>
					Siguiente
				</button>
			</div>

			<!--Botón para crear entrada-->
			<div style="margin-top: 20px; display: flex; justify-content: space-between;">
				<button
					style="background-color: #0366d6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
					on:click={() => {
						showForm = true;
					}}>Crear Entrada</button
				>
				<!---->
				<button
					style="background-color: #FF0000; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
					on:click={() => {
						deleteALL();
					}}>Eliminar Todos</button
				>
			</div>
		</div>
		<!---->
		<!-- Popup para crear nuevo objeto -->
		{#if showForm}
			<div class="modal">
				<div
					class="modal-content"
					style="background-color: #f2f2f2; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); padding: 20px;"
				>
					<span
						class="close"
						on:click={() => {
							showForm = false;
						}}>&times;</span
					>
					<h2 style="color: #0366d6; text-align: center;">Crear Nueva Entrada</h2>
					<form on:submit|preventDefault={postVehicle}>
						<div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
							<div style="width: calc(50% - 10px); margin-bottom: 10px;">
								<label for="freq">Freq:</label>
								<input
									type="text"
									id="freq"
									bind:value={newDato.freq}
									style="width: calc(100% - 25px); padding: 5px; border-radius: 5px; border: 1px solid #ccc;"
									required
								/>
							</div>
							<div style="width: calc(50% - 10px); margin-bottom: 10px;">
								<label for="vehicle">Vehicle:</label>
								<input
									type="text"
									id="vehicle"
									bind:value={newDato.vehicle}
									style="width: calc(100% - 25px); padding: 5px; border-radius: 5px; border: 1px solid #ccc;"
									required
								/>
							</div>
							<div style="width: calc(50% - 10px); margin-bottom: 10px;">
								<label for="unit">Unit:</label>
								<input
									type="text"
									id="unit"
									bind:value={newDato.unit}
									style="width: calc(100% - 25px); padding: 5px; border-radius: 5px; border: 1px solid #ccc;"
									required
								/>
							</div>
							<div style="width: calc(50% - 10px); margin-bottom: 10px;">
								<label for="geo">Geo:</label>
								<input
									type="text"
									id="geo"
									bind:value={newDato.geo}
									style="width: calc(100% - 25px); padding: 5px; border-radius: 5px; border: 1px solid #ccc;"
									required
								/>
							</div>
							<div style="width: calc(50% - 10px); margin-bottom: 10px;">
								<label for="year">Year:</label>
								<input
									type="number"
									id="year"
									bind:value={newDato.year}
									style="width: calc(100% - 25px); padding: 5px; border-radius: 5px; border: 1px solid #ccc;"
									required
								/>
							</div>
							<div style="width: calc(50% - 10px); margin-bottom: 10px;">
								<label for="obs_value">Obs Value:</label>
								<input
									type="number"
									id="obs_value"
									bind:value={newDato.obs_value}
									style="width: calc(100% - 25px); padding: 5px; border-radius: 5px; border: 1px solid #ccc;"
									required
								/>
							</div>
							<div style="width: calc(50% - 10px); margin-bottom: 10px;">
								<label for="flights_passangers">Flights Passangers:</label>
								<input
									type="number"
									id="flights_passangers"
									bind:value={newDato.flights_passangers}
									style="width: calc(100% - 25px); padding: 5px; border-radius: 5px; border: 1px solid #ccc;"
									required
								/>
							</div>
							<div style="width: calc(50% - 10px); margin-bottom: 10px;">
								<label for="cars_deaths">Cars Deaths:</label>
								<input
									type="number"
									id="cars_deaths"
									bind:value={newDato.cars_deaths}
									style="width: calc(100% - 25px); padding: 5px; border-radius: 5px; border: 1px solid #ccc;"
									required
								/>
							</div>
						</div>
						<div style="text-align: center; margin-top: 20px;">
							<button
								type="submit"
								style="background-color: #0366d6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
								>Crear</button
							>
						</div>
					</form>
				</div>
			</div>
		{/if}
		<!-- Botón desplegable de filtro -->
		{#if showFilter}
			<div class="modal">
				<div
					class="modal-content"
					style="background-color: #f2f2f2; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); padding: 20px;"
				>
					<span
						class="close"
						on:click={() => {
							showFilter = false;
						}}>&times;</span
					>
					<h2 style="color: #0366d6; text-align: center;">Aplicar filtros</h2>
					<form on:submit|preventDefault={getVehiclesFilter}>
						<div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
							<div style="width: calc(50% - 10px); margin-bottom: 10px;">
								<label for="freq">Freq:</label>
								<input
									type="text"
									id="freq"
									bind:value={selectedFilter.freq}
									style="width: calc(100% - 25px); padding: 5px; border-radius: 5px; border: 1px solid #ccc;"
								/>
							</div>
							<div style="width: calc(50% - 10px); margin-bottom: 10px;">
								<label for="vehicle">Vehicle:</label>
								<input
									type="text"
									id="vehicle"
									bind:value={selectedFilter.vehicle}
									style="width: calc(100% - 25px); padding: 5px; border-radius: 5px; border: 1px solid #ccc;"
								/>
							</div>
							<div style="width: calc(50% - 10px); margin-bottom: 10px;">
								<label for="unit">Unit:</label>
								<input
									type="text"
									id="unit"
									bind:value={selectedFilter.unit}
									style="width: calc(100% - 25px); padding: 5px; border-radius: 5px; border: 1px solid #ccc;"
								/>
							</div>
							<div style="width: calc(50% - 10px); margin-bottom: 10px;">
								<label for="geo">Geo:</label>
								<input
									type="text"
									id="geo"
									bind:value={selectedFilter.geo}
									style="width: calc(100% - 25px); padding: 5px; border-radius: 5px; border: 1px solid #ccc;"
								/>
							</div>
							<div style="width: calc(50% - 10px); margin-bottom: 10px;">
								<label for="year">Year:</label>
								<input
									type="number"
									id="year"
									bind:value={selectedFilter.year}
									style="width: calc(100% - 25px); padding: 5px; border-radius: 5px; border: 1px solid #ccc;"
								/>
							</div>
							<div style="width: calc(50% - 10px); margin-bottom: 10px;">
								<label for="obs_value">Obs Value:</label>
								<input
									type="number"
									id="obs_value"
									bind:value={selectedFilter.obs_value}
									style="width: calc(100% - 25px); padding: 5px; border-radius: 5px; border: 1px solid #ccc;"
								/>
							</div>
							<div style="width: calc(50% - 10px); margin-bottom: 10px;">
								<label for="flights_passangers">Flights Passangers:</label>
								<input
									type="number"
									id="flights_passangers"
									bind:value={selectedFilter.flights_passangers}
									style="width: calc(100% - 25px); padding: 5px; border-radius: 5px; border: 1px solid #ccc;"
								/>
							</div>
							<div style="width: calc(50% - 10px); margin-bottom: 10px;">
								<label for="cars_deaths">Cars Deaths:</label>
								<input
									type="number"
									id="cars_deaths"
									bind:value={selectedFilter.cars_deaths}
									style="width: calc(100% - 25px); padding: 5px; border-radius: 5px; border: 1px solid #ccc;"
								/>
							</div>
						</div>
						<div style="text-align: center; margin-top: 20px;">
							<button
								style=" background-color: #0366d6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; "
								type="submit"
								onclick={() => {
									showFilter = false;
								}}>Filtrar</button
							>
							<button
								style="background-color: #FF6347; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;"
								on:click={() => {
									limpiarFiltros();
									showFilter = false;
								}}>Eliminar Filtros</button
							>
						</div>
					</form>
				</div>
			</div>
		{/if}
		{#if errorMsg != ''}
			ERROR: {errorMsg}
		{/if}
	{:else}
		<div style="justify-content: center; text-align: center; margin-top: 20px">
			<button
				style=" background-color: #0366d6; color: white; padding: 5px 20px; border: none; border-radius: 5px; cursor: pointer; "
				on:click={() => getInitialData()}
			>
				Cargar datos
			</button>
		</div>
		<p class="container">No hay datos disponibles</p>
	{/if}
</body>

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
		border-radius: 15px; /* Bordes más redondeados */
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Sombras */
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
		text-align: center;
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
