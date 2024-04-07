// @ts-check
const { test, expect } = require('@playwright/test');

test('Carga página principal', async ({ page }) => {
  await page.goto('http://localhost:8080/tourisms-per-age');
  await expect(page).toHaveTitle('tourisms-per-age');
  await expect(page).toHaveURL('http://localhost:8080/tourisms-per-age');
});

test('has title Proyecto SOS2324-10', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('http://localhost:8080');
    await expect(page).toHaveTitle(/Proyecto SOS2324-10/);
  });