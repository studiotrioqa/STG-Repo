import { Page } from '@playwright/test';

export class ItemSaveButton {
  constructor(private page: Page) {}

  // Clicks the Save button and waits for a short duration
  async save(): Promise<void> {
    await this.page.getByRole('button', { name: 'Save' }).click();
    await this.page.waitForTimeout(10000); // Adjust if needed
  }
}

export class MenuSaveButton {
  constructor(private page: Page) {}

  async menuSaveButton(): Promise<void> {
    await this.page.getByRole('button', { name: 'Save', exact: true }).click();
    await this.page.waitForTimeout(10000); // Adjust if needed
  }
}