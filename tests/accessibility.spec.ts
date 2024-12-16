import { test, expect } from '../fixtures/fixtures'; 
import { LoginPage } from '../pages/loginpage';
import AxeBuilder from '@axe-core/playwright';


test('Check store page for detectable accessibility issues', async ({ page, users, loginAs }) => {
    const consumer = users.find(user => user.username === 'Consumer');
    if (!consumer) {
        throw new Error('Consumer user is not found');
    }

    await loginAs(page, consumer);

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); 
    expect(accessibilityScanResults.violations).toEqual([]); 
});

test('Accessibility test for keyboard navigation on login page', async ({ page, checkFocus  }) => {
  await page.goto('https://hoff.is/login/');

  const loginPage = new LoginPage(page);
  
  await page.keyboard.press('Tab');
  await expect(loginPage.usernameInput).toBeVisible(); 
  await checkFocus(page, loginPage.usernameInput); 
  
  await page.keyboard.press('Tab');
  await expect(loginPage.passwordInput).toBeVisible(); 
  await checkFocus(page, loginPage.passwordInput); 
  
  await page.keyboard.press('Tab');
  await expect(loginPage.chooseUser).toBeVisible(); 
  await checkFocus(page, loginPage.chooseUser); 
  
  await page.keyboard.press('Tab');
  await expect(loginPage.submitButton).toBeVisible(); 
  await checkFocus(page, loginPage.submitButton); 

  await page.keyboard.press('Shift+Tab');
  await checkFocus(page, loginPage.chooseUser); 
  
  await page.keyboard.press('Shift+Tab');
  await checkFocus(page, loginPage.passwordInput); 
  
  await page.keyboard.press('Shift+Tab');
  await checkFocus(page, loginPage.usernameInput); 
  
  await page.fill('input[id="username"]', 'testuser');
  await page.fill('input[id="password"]', 'testpassword');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter'); 
    
  await expect(loginPage.errorMessage).toBeVisible(); 
  await expect(loginPage.errorMessage).toContainText('Incorrect password');    
});