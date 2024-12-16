import { APIRequestContext } from '@playwright/test';
import { Product } from '../types/types';


export async function getProductList(apiContext: APIRequestContext): Promise<Product[]> {
  const response = await apiContext.get('/store2/api/v1/product/list', {
    timeout: 60000,
  });

  if (!response.ok()) {
    throw new Error(`Failed to fetch product list: ${response.status()}`);
  }

  const productList = await response.json();

  const products = productList.products || productList.data;

  if (!Array.isArray(products)) {
    throw new Error(`Expected products to be an array, but received: ${typeof products}`);
  }

  return products;
}

export async function getProductDetails(apiContext: APIRequestContext, productId: string): Promise<Product> {
  const response = await apiContext.get(`/store2/api/v1/price/${productId}`, {
    timeout: 60000
  });

  if (!response.ok()) {
    throw new Error(`Failed to fetch product details for product ID ${productId}: ${response.status()}`);
  }

  const productDetails = await response.json();
  return productDetails;
}
