// @ts-check
const { test, expect } = require('@playwright/test');

test('Carga página principal', async ({ page }) => {
  await page.goto('https://sos2324-10.appspot.com/gdp-growth-rates');
  //await expect(page).toHaveTitle('gdp-growth-rates');
  await expect(page).toHaveURL('https://sos2324-10.appspot.com/gdp-growth-rates');
});

