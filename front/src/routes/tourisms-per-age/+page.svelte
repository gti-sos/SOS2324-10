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
	let errMsg = '';
	let exitMsg = '';

	onMount(() => {
		getTourisms();
	});

	async function getTourisms() {
		console.log(cars);
		try {
			let response = await fetch(API_ASC, {
				method: 'GET'
			});
			let data = await response.json();
			tourisms = data;
			console.log(data);

			if (response.ok) {
				let { data, total } = await response.json();
				tourisms = data;
				console.log(data);
				items = total;
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
				showForm = false;
				getTourisms();
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
</script>

{#if errMsg != ""}
        <hr>ERROR: {errMsg}
    {:else}
        {#if exitMsg != ""}
            <hr>EXITO: {exitMsg}
        {/if}
    {/if}
