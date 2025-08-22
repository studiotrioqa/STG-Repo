import { Page, Locator } from '@playwright/test';

export class SearchPLU {
  constructor(private page: Page) {}

  async searchPLU(PLU: string): Promise<void> {

    // Search and select the item
    await this.page.getByRole('textbox', { name: 'Search PLU / Item Name here' }).click();
    await this.page.getByRole('textbox', { name: 'Search PLU / Item Name here' }).fill(PLU);
    await this.page.locator('xpath=//div[@id="row-0"]').first().click();
  }
}