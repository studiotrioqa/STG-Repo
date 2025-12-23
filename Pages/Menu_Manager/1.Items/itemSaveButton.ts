import { Page } from '@playwright/test';

export class ItemSaveButton {
  constructor(private page: Page) {}

  // Clicks the Save button and waits for a short duration
  async save(): Promise<void> {

    await this.page.getByRole('button', { name: 'Save' }).click();

    // 0 price checker
    if (await this.page.locator('text=Price Check Alert').isVisible()) {
      await this.page.getByRole('button', { name: 'Continue Anyway' }).click();
    }
    
    // await this.page.waitForTimeout(10000);
  }
}

export class MenuSaveButton {
  constructor(private page: Page) {}

  async menuSaveButton(): Promise<void> {
    await this.page.getByRole('button', { name: 'Save', exact: true }).click();

    // 0 price checker
    if (await this.page.locator('text=Price Check Alert').isVisible()) {
      await this.page.getByRole('button', { name: 'Continue Anyway' }).click();
    }
    
    // await this.page.waitForTimeout(10000);
  }
}