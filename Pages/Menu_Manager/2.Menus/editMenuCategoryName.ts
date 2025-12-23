import { Page } from "@playwright/test";

export class EditMenuCategoryName {
  private editedcategoryName: string = '';
  constructor(private page: Page, private timestamp: string = '') {} // changed constructor

  async addMenuCategory(testInfo: any): Promise<string> {
    this.editedcategoryName = "EMC-" + this.timestamp; // Unique name using timestamp
    await this.page.locator('span[title="Edit Title"]').first().click();
    await this.page.locator('.category_title-input__QTxqx').press('Control+A');
    await this.page.locator('.category_title-input__QTxqx').fill(this.editedcategoryName);
    await this.page.locator('.category_title-input__QTxqx').press('Enter');
    await this.page.waitForTimeout(3000);

    return this.verifyMenuCategory();
  }

  async verifyMenuCategory(): Promise<string> {
    await this.page.waitForTimeout(10000);
    await this.page.goto("https://stg.my.deliverit.com.au/menu-manager/items");
    await this.page.getByRole('tab', { name: 'Menus' }).click();
    await this.page.waitForTimeout(5000); // Wait for the page to load
    const categoryButtons = this.page.locator(".categories_cate-item__bgKcv");
    const countCategoryButtons = await categoryButtons.count();

    // Iterate through each category button to find a match
    for (let i = 0; i < countCategoryButtons; i++) {
      const text = await categoryButtons.nth(i).textContent();
      if (text?.trim() === this.editedcategoryName) {
        const message = `Edited Menu Category Match Found: ${this.editedcategoryName}`;
        console.log(message);
        return message;
      }
    }

    const notFoundMessage = `Edited Menu Category "${this.editedcategoryName}" was not found after deployment.`;
    console.log(notFoundMessage);
    return notFoundMessage;
  }
  
}