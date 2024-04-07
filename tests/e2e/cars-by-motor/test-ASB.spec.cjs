/** 
const { test, expect } = require('@playwright/test');

test('Titulo', async ({ page }) => {
    await page.goto('http://localhost:8080/cars-by-motor');
    await expect(page).toHaveTitle('cars-by-motor');
    await expect(page).toHaveURL('http://localhost:8080/cars-by-motor');
});

test('delete car', async () => {
    test.setTimeout(60000);
    await page.goto('http://localhost:8080/api/v2/cars-by-motor/loadInitialData');
    await page.waitForTimeout(1000);
    await page.goto('http://localhost:8080/cars-by-motor');
    await page.waitForLoadState('load');
    await page.waitForTimeout(1000);
    let carTitleBeforeDelete = await page.textContent('.tarjeta:first-child .card-title');
    await page.click('#deletecarButton');
    await page.waitForTimeout(1000);
    let carTitleAfterDelete = await page.textContent('.tarjeta:first-child .card-title');
    expect(carTitleAfterDelete).not.toEqual(carTitleBeforeDelete);
});
test('delete cars', async () => {
    test.setTimeout(90000);
    await page.goto('http://localhost:8080/api/v2/cars-by-motor/loadInitialData');
    await page.waitForTimeout(1000);
    await page.goto('http://localhost:8080/cars-by-motor');
    await page.waitForLoadState('load');
    await page.waitForTimeout(1000);
    let cardElements = await page.locator('.tarjetas-datos').count();
    expect(cardElements).toBeGreaterThan(5);
    await page.click('#deleteAllButton');
    await page.waitForTimeout(500);
    await page.click('#deleteAllButtonConfirm');
    await page.waitForTimeout(8080);
    let updatedCardElements = await page.locator('.tarjetas-datos').count();
    expect(updatedCardElements).toBe(0);
});