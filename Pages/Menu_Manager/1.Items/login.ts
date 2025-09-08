import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async login(email: string, password: string) {
    const viewport = this.page.viewportSize();

    if (!viewport) throw new Error('Viewport not available');

    const { width, height } = viewport;

    if (width === 1920 && height === 1080) {
      await this.page.waitForTimeout(1000);
    } else if (width === 1680 && height === 1050) {
      await this.page.waitForTimeout(3000);
    } else if (width === 1366 && height === 768) {
      await this.page.waitForTimeout(6000);
    } else if (width < 1280) {
      await this.page.waitForTimeout(9000);
    }

    await this.page.getByRole('textbox', { name: 'Email' }).click();
    await this.page.getByRole('textbox', { name: 'Email' }).fill(email);

    await this.page.getByRole('textbox', { name: 'Password' }).click();
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);

    await this.page.getByRole('button', { name: 'Sign in' }).click();
    await this.page.waitForTimeout(10000);
  }
}