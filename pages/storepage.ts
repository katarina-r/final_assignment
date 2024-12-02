import { Locator, Page } from "@playwright/test"

export class StorePage {
    readonly page: Page;
    readonly header: Locator;
    readonly submitButton: Locator; 
    readonly usernameText: Locator; // New locator for username

    constructor(page: Page) {
        this.page = page;
        this.header = page.locator("h1");
        this.submitButton = page.getByRole('button', { name: "Log Out" }); 
        this.usernameText = page.getByTestId("username");
    };

    async logout() {
        await this.submitButton.click();
    };
   
     // New method to get the username
     async getUsername(){
        await this.usernameText.textContent(); // Gets the text content of the username element
    };
};


