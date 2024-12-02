import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/loginpage'; 
import { StorePage } from '../pages/storepage';

import * as fs from 'fs/promises'; // Läser innehållet i en fil och returnerar den som en textsträng. promises = använda asynkron filhantering
import * as path from 'path';  // För att hantera sökvägar
import * as dotenv from 'dotenv';

// Ladda miljövariabler från .env-filen
dotenv.config(); 

let users: Array<{ username: string, password: string, role: string }> = [];

// Funktion för att läsa och ladda testdata
async function loadTestData(filePath: string) {
  const fullPath = path.resolve(__dirname, filePath);  // Bygg absolut sökväg
  const data = await fs.readFile(fullPath, 'utf-8');  // Läs filen med UTF-8-kodning
  const testData = JSON.parse(data);  // Omvandla JSON-sträng till JavaScript-objekt
  return testData;
}

// Ladda testdata asynkront och skapa användare
test.beforeAll(async () => {
  const testData = await loadTestData('../data/testdata.json');  // Ladda testdata från filen
  users = testData.users.map(user => {
    let password: string | undefined;

    // Tilldela lösenord baserat på användarnamn
    if (user.username === 'Consumer') {
      password = process.env.VALIDPASSWORD;  
    } else if (user.username === 'Business') {
      password = process.env.VALIDPASSWORD;  
    } else if (user.username === 'InvalidUser') {
      password = process.env.INVALIDPASSWORD; 
    }

    if (!password) {
      throw new Error(`Password for user ${user.username} is undefined`);
    }

    return {
      ...user,
      password // Lägg till lösenordet
    };
  });
});

async function loginAs(page, user: { username: string, password: string, role: string }) {
  const loginPage = new LoginPage(page);
  await loginPage.login(user.username, user.password, user.role); 
}

test.beforeEach('Pre test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goToPage();
});

// Tester
test('Login as Consumer', async ({ page }) => {
  const storePage = new StorePage(page);
  const user = users[0];

  await loginAs(page, user);
  const header = await storePage.header.textContent();

  expect(header).toBe("Store");
});

test('Login as Business', async ({ page }) => {
  const storePage = new StorePage(page);
  const user = users[1];

  await loginAs(page, user);
  const header = await storePage.header.textContent();

  expect(header).toBe("Store");
});

test('Verify error message when password is incorrect', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const user = users[2];

  await loginAs(page, user);
  const errorMessage = await loginPage.errorMessage.textContent();

  expect(errorMessage).toBe("Incorrect password");
});

test('Verify log out function', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const storePage = new StorePage(page);
  const user = users[0];

  await loginAs(page, user);
  await storePage.logout();

  const header = await loginPage.header.textContent();
  expect(header).toBe("Login");
});
