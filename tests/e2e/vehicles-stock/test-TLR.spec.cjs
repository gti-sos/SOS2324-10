const { test, expect } = require('@playwright/test');

//Comprobamos el correcto inicio de la web
test('Carga de vehicles-stock', async ({ page }) => {
  await page.goto('https://sos2324-10.appspot.com/vehicles-stock');

  // Verificar que la página se cargó correctamente
  await expect(page).toHaveTitle('vehicles-stock');
  await expect(page).toHaveURL('https://sos2324-10.appspot.com/vehicles-stock');
});

// Test para probar la funcionalidad de paginación
test('Paginación de vehicles-stock', async ({ page }) => {
  await page.goto('https://sos2324-10.appspot.com/vehicles-stock');

  // Verificar que se muestra la tabla de datos
  const table = await page.waitForSelector('table');
  expect(table).not.toBeNull();

  // Verificar que la paginación funciona correctamente
  await page.click('button:has-text("Siguiente")'); // Ir a la siguiente página
  await page.click('button:has-text("Anterior")');    // Volver a la página anterior
});

// Test para probar la funcionalidad de filtrado
test('Filtros de vehicles-stock', async ({ page }) => {
  await page.goto('https://sos2324-10.appspot.com/vehicles-stock');

  // Verificar que se muestra el formulario de filtros
  await page.click('button:has-text("Filtros")');
  const filterForm = await page.waitForSelector('form');
  expect(filterForm).not.toBeNull();

  // Rellenar y enviar el formulario de filtros
  await page.fill('input[name="geo"]', 'Albania');
  await page.click('button:has-text("Filtrar")');

  // Verificar que se aplicaron los filtros correctamente
  // Aquí puedes agregar expectativas para verificar que se muestran los resultados esperados en la tabla
});

// Otros tests para probar las demás funcionalidades (creación de entradas, eliminación, etc.)

// Ejecutar el test suite con "npx folio"
