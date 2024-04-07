/** 
const { test, expect } = require('@playwright/test');

test('Titulo', async ({ page }) => {
    await page.goto('http://localhost:8080/cars-by-motor');
    await expect(page).toHaveTitle('cars-by-motor');
    await expect(page).toHaveURL('http://localhost:8080/cars-by-motor');
});

test('Proyecto SOS2324-10', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('http://localhost:8080');
    await expect(page).toHaveTitle(/Proyecto SOS2324-10/);
});