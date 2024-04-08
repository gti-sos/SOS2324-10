







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
  await page.waitForLoadState('networkidle');
  const loadDataButton = await page.$('button:has-text("Cargar datos")');
  if (loadDataButton) {
    await loadDataButton.click();
    await page.waitForTimeout(1000); 
  }
  const noDataMessage = await page.$('p.container:has-text("No hay datos disponibles")');

  if (noDataMessage) {
    console.log('No hay datos disponibles');
  } else {
    const table = await page.waitForSelector('table');
    expect(table).not.toBeNull();
    await page.click('button:has-text("Siguiente")'); 
    await page.click('button:has-text("Anterior")');
  }
});



async function verificarCantidadDatos(page) {
  const rows = await page.$$('table tbody tr');
  return rows.length === 10;
}
/*
//Comprobamos que únicamente se muestren 10 datos en la web
test('Verificar offset vehicles-stock', async ({ page }) => {
  await page.goto('https://sos2324-10.appspot.com/vehicles-stock');

  const table = await page.waitForSelector('table', { timeout: 20000 });


  expect(table).not.toBeNull();

  const correctCantidadDatos = await verificarCantidadDatos(page);
  expect(correctCantidadDatos).toBe(true);
});


*/


