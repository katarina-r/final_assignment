import { Page } from '@playwright/test';
import { User } from '../types/types';
import { LoginPage } from '../pages/loginpage';


export async function loginAs(page: Page, users: User[], user: User): Promise<void> {
  const userData = users.find(u => u.username === user.username);
  if (!userData) {
    throw new Error(`User with username ${user.username} not found in test data`);
  }

  const password = userData.password || process.env.INVALIDPASSWORD;

  await page.goto('https://hoff.is/login/');
  const loginPage = new LoginPage(page);
  await loginPage.login(user.username, user.password, user.role);
}


