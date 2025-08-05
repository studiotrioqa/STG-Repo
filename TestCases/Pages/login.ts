import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private loggedPage: Page) {}

  async login(email: string, password: string) {
    const page = this.loggedPage;

    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill(email);

    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill(password);

    await page.getByRole('button', { name: 'Sign in' }).click();

     // Step 1: Wait for navigation
    await page.waitForURL('**/menu-manager/items'); // Replace with your actual path

    // Step 2: Wait for a key UI element to confirm Studio has loaded
    await page.locator('#btn-store-selector').nth(0).waitFor(); // put here the locator
  }
}
