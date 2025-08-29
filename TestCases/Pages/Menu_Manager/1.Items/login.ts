import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async login(email: string, password: string) {

    await this.page.getByRole('textbox', { name: 'Email' }).click();
    await this.page.getByRole('textbox', { name: 'Email' }).fill(email);

    await this.page.getByRole('textbox', { name: 'Password' }).click();
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);

    await this.page.getByRole('button', { name: 'Sign in' }).click();

     // Step 1: Wait for navigation
    await this.page.waitForURL('**/menu-manager/items'); // Replace with your actual path

    // Step 2: Wait for a key UI element to confirm Studio has loaded
    await this.page.locator('#btn-store-selector').nth(0).waitFor(); // put here the locator
  }
}