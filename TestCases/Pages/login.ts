import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private loggedPage: Page) {}

  async login(email: string, password: string) {

    await this.loggedPage.getByRole('textbox', { name: 'Email' }).click();
    await this.loggedPage.getByRole('textbox', { name: 'Email' }).fill(email);

    await this.loggedPage.getByRole('textbox', { name: 'Password' }).click();
    await this.loggedPage.getByRole('textbox', { name: 'Password' }).fill(password);

    await this.loggedPage.getByRole('button', { name: 'Sign in' }).click();

     // Step 1: Wait for navigation
    await this.loggedPage.waitForURL('**/menu-manager/items'); // Replace with your actual path

    // Step 2: Wait for a key UI element to confirm Studio has loaded
    await this.loggedPage.locator('#btn-store-selector').nth(0).waitFor(); // put here the locator
  }
}
