import { test, expect } from '../fixtures/fixtures'; 
import { Product } from '../types/types';


test('Verify that product details is fetched correctly from API', async ({page, users, getProductDetails, getProductList }) => {
     const productList: Product[] = await getProductList();  

     expect(productList.length).toBeGreaterThan(0); 
 
     for (const product of productList) {
         const productDetails = await getProductDetails(product.id); 

         expect(productDetails.id).toBe(product.id);  
         expect(productDetails.name).toBe(product.name);  
         expect(productDetails.price).toBeGreaterThan(0); 
         expect(productDetails.vat).toBeGreaterThanOrEqual(0); 
     }
});
  