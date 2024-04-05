// @ts-check
const { test, expect } = require('@playwright/test');

test('Carga página principal', async ({ page }) => {
  await page.goto('https://sos2324-10.appspot.com/gdp-growth-rates');
  await expect(page).toHaveTitle('gdp-growth-rates');
  await expect(page).toHaveURL('https://sos2324-10.appspot.com/gdp-growth-rates');
});


test('Eliminar dato', async ({ page }) => {
  await page.goto('https://sos2324-10.appspot.com/gdp-growth-rates');

  // Hacer clic en el botón de eliminar del primer dato de la lista
  await page.click('tbody tr:first-child button:has-text("Eliminar")');

  // Verificar que se muestra un mensaje de éxito
  await expect(page.getByText('EXITO: Dato eliminado correctamente')).toBeVisible();
});

// Test para verificar la búsqueda de datos
test('Búsqueda de datos', async ({ page }) => {
  await page.goto('https://sos2324-10.appspot.com/gdp-growth-rates');

  // Realizar una búsqueda por país
  await page.fill('#countryInput', 'spain');
  await page.click('button:has-text("Buscar")');

  // Esperar a que se muestre el resultado de la búsqueda
  await page.waitForSelector('table tbody tr');

  // Obtener el texto del primer resultado de la búsqueda
  const searchResult = await page.$eval('table tbody tr:first-child', row => row.textContent);

  // Verificar que el resultado de la búsqueda contiene "Spain"
  await expect(searchResult).toContain('spain');
});

/**
// Test para verificar la creación de un nuevo dato
test('Crear nuevo dato', async ({ page }) => {
  await page.goto('https://sos2324-10.appspot.com/gdp-growth-rates');

  // Hacer clic en el botón para mostrar el formulario de creación
  await page.click('button:has-text("Crear Entrada")');

  // Rellenar el formulario con datos de prueba
  await page.getByPlaceholder('name@example.com').fill('playwright@microsoft.com');
  await page.fill('#unit', 'b');
  await page.fill('#na_item', 'c');
  await page.fill('#geo', 'sudan');
  await page.fill('#time_period', '2010');
  await page.fill('#obs_value', '1');
  await page.fill('#growth_rate_2030', '2');
  await page.fill('#growth_rate_2040', '3');

  // Enviar el formulario
  await page.click('button:has-text("Crear")');

  // Verificar que se muestra un mensaje de éxito
  const successMessage = await page.locator('body').textContent();
  await expect(page.getByText('EXITO: Dato eliminado correctamente')).toBeVisible();
});*/

