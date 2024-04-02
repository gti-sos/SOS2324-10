const { test, expect } = require('@playwright/test');

//Comprobamos el correcto inicio de la web
test('Carga de vehicles-stock', async ({ page }) => {
  await page.goto('https://sos2324-10.appspot.com/vehicles-stock');
  await expect(page).toHaveTitle('vehicles-stock');
  await expect(page).toHaveURL('https://sos2324-10.appspot.com/vehicles-stock');
});

//Comprobamos el correcto funcionamiento de la paginación
test('Paginación de vehicles-stock', async ({ page }) => {
  await page.goto('https://sos2324-10.appspot.com/vehicles-stock');

  // Esperar un corto tiempo para asegurarse de que la página esté completamente cargada
  await page.waitForLoadState('networkidle');

  // Intentar hacer clic en el botón "Cargar datos"
  const loadDataButton = await page.$('button:has-text("Cargar datos")');
  if (loadDataButton) {
    await loadDataButton.click();
    // Esperar un corto tiempo para que los datos se carguen después de hacer clic en el botón
    await page.waitForTimeout(2000); // Ajusta este tiempo según sea necesario
  }

  // Verificar si el mensaje "No hay datos disponibles" está presente
  const noDataMessage = await page.$('p.container:has-text("No hay datos disponibles")');

  if (noDataMessage) {
    // No hay datos disponibles, se puede continuar con la prueba de paginación si es necesario
    console.log('No hay datos disponibles');
  } else {
    // Esperar a que se muestre la tabla
    const table = await page.waitForSelector('table');
    expect(table).not.toBeNull();

    // Realizar la paginación
    await page.click('button:has-text("Siguiente")'); 
    await page.click('button:has-text("Anterior")');
  }
});



async function verificarCantidadDatos(page) {
  const rows = await page.$$('table tbody tr');
  return rows.length === 10;
}

//Comprobamos que únicamente se muestren 10 datos en la web
test('Verificar offset vehicles-stock', async ({ page }) => {
  await page.goto('https://sos2324-10.appspot.com/vehicles-stock');

  const table = await page.waitForSelector('table');
  expect(table).not.toBeNull();

  const correctCantidadDatos = await verificarCantidadDatos(page);
  expect(correctCantidadDatos).toBe(true);
});





