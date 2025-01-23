import { test, expect } from '@playwright/test';

test('User can log out and collection link disappears', async ({ page }) => {
    
  await page.goto('http://localhost:3000/user/logout');


  await page.click('button:has-text("Logout")');

  await page.waitForURL('**/user/login');

  const collectionLink = page.locator('text=Collection');
  await expect(collectionLink).not.toBeVisible();
});