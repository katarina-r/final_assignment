import { Locator, Page } from "@playwright/test"

export class StorePage {
    readonly page: Page;
    readonly header: Locator;
    readonly submitButton: Locator; 
    readonly removeButtons: Locator[] = []; 

    constructor(page: Page) {
        this.page = page;
        this.header = page.locator("h1");
        this.submitButton = page.getByRole('button', { name: "Log Out" }); 
    }

    async logout() {
        await this.submitButton.click();
    }
   
    async selectProduct(productId: string) {
        await this.page.getByTestId('select-product').selectOption(productId);
    }
  
    async fillAmount(amount: string) {
        await this.page.getByLabel('Amount').click();
        await this.page.getByLabel('Amount').fill(amount);
    }
  
    async addToCart() {
        await this.page.getByTestId('add-to-cart-button').click();
    }
  
    async clickBuyButton() {
        await this.page.getByRole('button', { name: 'Buy' }).click();
    }
  
    async fillName(name: string) {
        await this.page.getByLabel('Name:').click();
        await this.page.getByLabel('Name:').fill(name);
        await this.page.getByLabel('Name:').press('Tab');
    }

    async fillAddress(address: string) {
        await this.page.getByLabel('Address:').fill(address);
    }

    async confirmPurchase() {
        await this.page.getByRole('button', { name: 'Confirm Purchase' }).click();
    }
    
    async completePurchase() {
        await this.page.getByText('Thank you for your purchase,').click();
        await this.page.getByText('Close').click();
    }

    async trackRemoveButton(productName: string) {
        const removeButton = this.page.locator(`[data-testid='${productName}-remove-button']`);
        this.removeButtons.push(removeButton);
    }

    async removeItem(productName: string) {
        const removeButton = this.removeButtons.find((button) => button.locator(`[data-testid='${productName}-remove-button']`));
        if (removeButton) {
            await removeButton.click(); 
        } else {
            throw new Error(`Remove button for product ${productName} not found`);
        }
    }
}