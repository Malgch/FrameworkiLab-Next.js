import { test, expect } from '@playwright/test';

test('User can edit profile data', async ({ page }) => {
    await page.goto('http://localhost:3000/user/profile');
  

    await page.fill('#username', 'TestUser');
    await page.fill('#city', 'Krakow');
    await page.fill('#street', 'Street');
    await page.fill('#zipCode', '30-001');
    await page.fill('#photoURL', 'https://via.placeholder.com/150.jpg');
  
    await page.click('button[type="submit"]');
  
    await page.waitForSelector('button:has-text("Update Profile")');
  
    const updatedUsername = await page.inputValue('#username');
    expect(updatedUsername).toBe('TestUser');
  });