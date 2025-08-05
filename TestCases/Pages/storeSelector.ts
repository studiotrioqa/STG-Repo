import { Page } from '@playwright/test';

export class StoreSelector {
  constructor(private page: Page) {}

  // Determines the store name based on viewport resolution.
  private async getStoreNameByResolution(): Promise<string> {
    const viewport = this.page.viewportSize();
    if (!viewport) {
      throw new Error('Viewport not available');
    }

    const { width, height } = viewport;

    if (width === 1920 && height === 1080) {
      return 'VS Test Store 01';
    } else if (width === 1680 && height === 1050) {
      await this.page.waitForTimeout(1000);
      return 'VS Test Store 02';
    } else if (width === 1366 && height === 768) {
      await this.page.waitForTimeout(2000);
      return 'VS Test Store 03';
    } else if (width < 1280) {
      await this.page.waitForTimeout(3000);
      return 'VS Test Store 04';
    }

    throw new Error('Unable to determine store name from screen resolution.');
  }

  // Selects the store in the UI based on resolution.
  async selectStore(): Promise<string> {
    const storeName = await this.getStoreNameByResolution();

    await this.page.locator('#btn-store-selector').first().click();
    await this.page.getByRole('searchbox', { name: 'Search' }).fill(storeName);
    await this.page.getByRole('button', { name: storeName }).click();
    await this.page.waitForTimeout(10000);
    return storeName;
  }
}
