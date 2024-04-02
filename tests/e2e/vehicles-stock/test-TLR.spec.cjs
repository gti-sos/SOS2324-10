const { test, expect } = require('@playwright/test');

//Comprobamos el correcto inicio de la web
test('Carga de vehicles-stock', async ({ page }) => {
  await page.goto('https://sos2324-10.appspot.com/vehicles-stock');
  await expect(page).toHaveTitle('vehicles-stock');
  await expect(page).toHaveURL('https://sos2324-10.appspot.com/vehicles-stock');
});
