
<nav class="container">
	<a href="/" class="nav-link">Inicio</a>
	<a href="/analytics" class="nav-link">Vista Grupal</a>
	<div class="dropdown">
		<button class="dropbtn">vehicles-stock</button>
		<div class="dropdown-content">
			<a href="/vehicles-stock">Tabla</a>
			<a href="/vehicles-stock/vistas">Vista</a>
		</div>
	</div>
	<div class="dropdown">
		<button class="dropbtn">gdp-growth-rates</button>
		<div class="dropdown-content">
			<a href="/gdp-growth-rates">Tabla</a>
			<a href="/gdp-growth-rates/vistas">Vista</a>
		</div>
	</div>
	<div class="dropdown">
		<button class="dropbtn">cars-by-motor</button>
		<div class="dropdown-content">
			<a href="/cars-by-motor">Tabla</a>
			<a href="/cars-by-motor/vistas">Vista</a>
		</div>
	</div>
	<div class="dropdown">
		<button class="dropbtn">tourisms-per-age</button>
		<div class="dropdown-content">
			<a href="/tourisms-per-age">Tabla</a>
			<a href="/tourisms-per-age/vistas">Vista</a>
		</div>
	</div>
</nav>

<style>
	.container {
		width: 80%;
		margin: 20px auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff; /* Blanco */
		border: 1px solid #a4caef; /* Azul claro */
		border-radius: 5px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		padding: 10px 20px;
	}

	.nav-link {
		color: #0366d6; /* Azul */
		text-decoration: none;
		padding: 10px 15px;
		border-radius: 5px;
		transition: background-color 0.3s ease;
	}

	.nav-link:hover {
		background-color: #f0f7ff; /* Azul claro */
	}

	/* Dropdown container */
	.dropdown {
		position: relative;
		display: inline-block;
	}

	/* Dropdown button */
	.dropbtn {
		background-color: transparent;
		color: #0366d6; /* Azul */
		border: none;
		padding: 15px 15px; /* Aumenta el padding */
		font-size: 16px; /* Aumenta el tamaño de la fuente */
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s ease;
		position: relative;
	}

	.dropbtn:hover {
		background-color: #f0f7ff; /* Azul claro */
	}

	/* Dropdown content (hidden by default) */
	.dropdown-content {
		display: none;
		position: absolute;
		background-color: #fff;
		border: 1px solid #ccc; /* Borde negro clarito */
		border-radius: 5px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		z-index: 1;
		top: calc(100% + 5px); /* Ajuste la posición vertical del menú desplegable */
		left: 0;
		min-width: 160px;
	}

	/* Links inside the dropdown */
	.dropdown-content a {
		color: #0366d6; /* Azul */
		padding: 10px 15px;
		text-decoration: none;
		display: block;
		border-radius: 5px;
		transition: background-color 0.3s ease;
	}

	/* Change color of dropdown links on hover */
	.dropdown-content a:hover {
		background-color: #f0f7ff; /* Azul claro */
	}

	/* Show the dropdown menu on hover */
	.dropdown:hover .dropdown-content {
		display: block;
	}

	/* Flecha indicativa */
	.dropdown:hover .dropbtn::after {
		content: '\25BC'; /* Código Unicode para la flecha hacia abajo */
		position: absolute;
		top: calc(100% - 5px); /* Ajuste de la posición vertical de la flecha */
		left: 50%;
		transform: translateX(-50%);
		font-size: 14px;
		color: #0366d6; /* Color azul */
	}

	/* Mantener el menú desplegable abierto mientras el cursor esté sobre él */
	.dropdown-content:hover {
		display: block;
	}
</style>
