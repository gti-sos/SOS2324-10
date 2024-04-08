// @ts-check

const { test, expect } = require('@playwright/test');

const carga = 'http://localhost:8080/gdp-growth-rates/loadInitialData';
const URL_web = 'https://sos2324-10.appspot.com/gdp-growth-rates';


//Cargar página
test('Carga página principal', async ({ page }) => {
  test.setTimeout(60000);
  //await page.goto(carga);
  await page.goto(URL_web);


  await expect(page).toHaveTitle('gdp-growth-rates');

  await expect(page).toHaveURL(URL_web);
});


//Lista de todos los recursos
test('Listar todos los elementos correctamente', async ({ page }) => {
  test.setTimeout(60000);
  //await page.goto(carga);
  await page.goto(URL_web);


  await page.click('button:has-text("Cargar datos de prueba")');

  await page.waitForSelector('table');

  const rows = await page.$$('table tbody tr');

  expect(rows.length).toBeGreaterThan(0);

  for (const row of rows) {
    const columns = await row.$$('td');
    expect(columns.length).toBeGreaterThan(0);
  }
});

/*

//Crear nuevo dato
test('Crear nuevo dato', async ({ page }) => {
  test.setTimeout(90000);
  //await page.goto(carga);
  await page.goto(URL_web);
  

  await page.click('button:has-text("Crear Entrada")');

  await page.getByPlaceholder('frequency').fill('a');
  await page.getByPlaceholder('unit').fill('b');
  await page.getByPlaceholder('na_item').fill('c');
  await page.getByPlaceholder('geo').fill('mexico');
  await page.getByPlaceholder('time_period').fill('2020');
  await page.getByPlaceholder('valor_obs').fill('1');
  await page.getByPlaceholder('growth_rate_2030').fill('2');
  await page.getByPlaceholder('growth_rate_2040').fill('3');

  await page.waitForSelector('button[type="submit"]');
  await page.click('button[type="submit"]');

  await expect(page.getByText('EXITO: Dato creado correctamente')).toBeVisible();
});


//Eliminar dato
test('Eliminar dato', async ({ page }) => {
  test.setTimeout(60000);
  //await page.goto(carga);
  await page.goto(URL_web);
  await page.click('tbody tr:first-child button:has-text("Eliminar")');

  await expect(page.getByText('EXITO: Dato eliminado correctamente')).toBeVisible();
});

/*
//Eliminar todos los datos
test('Eliminar todos los datos', async ({ page }) => {
  test.setTimeout(60000);
  //await page.goto(carga);
  await page.goto(URL_web);

  await page.click('button:has-text("Eliminar Todos")');

  await expect(page.getByText('EXITO: Todos los datos fueron eliminados')).toBeVisible();
});*/

/*
test('Paginacion correcta', async ({ page }) => {
  test.setTimeout(80000);
  await page.goto(carga);
  await page.goto(URL_web);
  await page.waitForLoadState('load');
  await page.waitForTimeout(1000);

  let resourceTitleFirstPage = await page.innerText('.container table tbody tr:first-child td:nth-child(6)');
  
  await page.click('button:has-text("Siguiente")');
  await page.waitForTimeout(1000);
  
  let resourceTitleSecondPage = await page.innerText('.container table tbody tr:first-child td:nth-child(6)');
  
  expect(resourceTitleSecondPage).not.toEqual(resourceTitleFirstPage);
});*/