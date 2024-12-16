import { test, expect } from '../fixtures/fixtures'; 
import { StorePage } from '../pages/storepage';
import { Product } from '../types/types';


test('Make a purchase as Consumer', async ({ page, users, getProductList, loginAs }) => {
  const consumer = users.find(user => user.username === 'Consumer');
  if (!consumer) {
    throw new Error('Consumer user is not found');
  }

  await loginAs(page, consumer);

  const productList: Product[] = await getProductList(); 
  if (productList.length === 0) {
    throw new Error('No products found');
  }

  const storePage = new StorePage(page);
  const amount = Math.floor(Math.random() * 10) + 1;
  const amountAsString = String(amount);

  await storePage.selectProduct(productList[0].id.toString());  
  await storePage.fillAmount(amountAsString); 
  await storePage.addToCart(); 

  await storePage.clickBuyButton();
  await storePage.fillName(consumer.username);  
  await storePage.fillAddress(consumer.address);
  await storePage.confirmPurchase(); 

  await expect(page.getByText(`Thank you for your purchase, ${consumer.username}`)).toBeVisible(); 
  await storePage.completePurchase(); 
});

test('Remove item from cart', async ({ page, users, getProductList, loginAs }) => {
  const consumer = users.find(user => user.username === 'Consumer');
  if (!consumer) {
    throw new Error('Consumer user is not found');
  }

  await loginAs(page, consumer);

  const productList: Product[] = await getProductList(); 
  if (productList.length === 0) {
    throw new Error('No products found');
  }

  const storePage = new StorePage(page);

  await storePage.selectProduct(productList[1].id.toString()); 
  await storePage.fillAmount('4');
  await storePage.addToCart();
  await storePage.trackRemoveButton(productList[1].name);

  await storePage.selectProduct(productList[2].id.toString()); 
  await storePage.fillAmount('6');
  await storePage.addToCart();
  await storePage.trackRemoveButton(productList[2].name);

  await storePage.removeItem(productList[1].name); 
  
  await expect(page.getByText('Message: Removed item from')).toBeVisible();
});