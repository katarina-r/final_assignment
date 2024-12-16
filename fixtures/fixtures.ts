import { APIRequestContext, Page, test as base, request, expect } from '@playwright/test';
import { Product, User } from '../types/types';
import { loadTestData } from './userFixtures';
import { loginAs } from './authFixtures';
import { getProductList, getProductDetails } from './productFixtures';
import { checkFocus } from './accessibilityFixtures';


type TestFixtures = {
  users: User[];
  loginAs: (page: Page, user: User) => Promise<void>;
  apiContext: APIRequestContext;
  getProductList: () => Promise<Product[]>;
  getProductDetails: (productId: number) => Promise<Product>;
  checkFocus: typeof checkFocus;  
}

export const test = base.extend<TestFixtures>({
  users: async ({}, use) => {
    const users = await loadTestData('../data/testdata.json');
    await use(users);
  },

  loginAs: async ({ users }, use) => {
    await use((page: Page, user: User) => loginAs(page, users, user));
  },

  apiContext: async ({}, use) => {
    const apiContext = await request.newContext({
      baseURL: 'https://hoff.is',
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      }
    });
    await use(apiContext);
    await apiContext.dispose();
  },

  getProductList: async ({ apiContext }, use) => {
    const products = await getProductList(apiContext);
    await use(() => Promise.resolve(products));
  },

  getProductDetails: async ({ apiContext }, use) => {
    await use(async (productId: number) => {
      const productDetails = await getProductDetails(apiContext, productId.toString());
      return productDetails;
    });
  },
  
  checkFocus: async ({}, use) => {
    await use(checkFocus);  
  }
});

export { expect };