import { test, expect } from '../fixtures/fixtures';
import { LoginPage } from '../pages/loginpage';
import { StorePage } from '../pages/storepage';


test('Log in as Consumer', async ({ page, users, loginAs }) => {
  const storePage = new StorePage(page);
  const consumer = users.find(user => user.username === 'Consumer');

  if (!consumer) {
    throw new Error('Consumer user is not found');
  }

  await loginAs(page, consumer);
  
  const header = await storePage.header.textContent();
  expect(header).toBe("Store");
});

test('Log in as Business', async ({ page, users, loginAs }) => {
  const storePage = new StorePage(page);
  const business = users.find(user => user.username === 'Business');

  if (!business) {
    throw new Error('Business user is not found');
  }

  await loginAs(page, business);
  const header = await storePage.header.textContent();

  expect(header).toBe("Store");
});

test('Verify error message when password is incorrect', async ({ page, users, loginAs }) => {
  const loginPage = new LoginPage(page);
  const invalidUser = users.find(user => user.username === 'InvalidUser');

  if (!invalidUser) {
    throw new Error('InvalidUser user not found');
  }

  await loginAs(page, invalidUser);
  const errorMessage = await loginPage.errorMessage.textContent();

  expect(errorMessage).toBe("Incorrect password");
});

test('Verify log out function', async ({ page, users, loginAs }) => {
  const loginPage = new LoginPage(page);
  const storePage = new StorePage(page);
  const consumer = users.find(user => user.username === 'Consumer');

  if (!consumer) {
    throw new Error('Consumer user not found');
  }

  await loginAs(page, consumer);
  await storePage.logout();

  const header = await loginPage.header.textContent();
  expect(header).toBe("Login");
});