import { Page } from "@playwright/test";
import { LoggedPage } from "../../../Utilities/logger";

export class EditMenuCategoryName {
  private editedcategoryName: string = '';
  constructor(private logged: LoggedPage) {}

  async addMenuCategory(testInfo: any): Promise<string> {
    this.editedcategoryName = "EMC-" + this.logged.timestamp; // Unique name using timestamp
    await this.logged.page.locator('span[title="Edit Title"]').first().click();
    await this.logged.page.locator('.category_title-input__QTxqx').press('Control+A');
    await this.logged.page.locator('.category_title-input__QTxqx').fill(this.editedcategoryName);
    await this.logged.page.locator('.category_title-input__QTxqx').press('Enter');
    await this.logged.page.waitForTimeout(3000);

    return this.verifyMenuCategory();
  }

  async verifyMenuCategory(): Promise<string> {
    await this.logged.page.waitForTimeout(10000);
    await this.logged.page.goto("https://stg.my.deliverit.com.au/menu-manager/items");
    await this.logged.page.getByRole('tab', { name: 'Menus' }).click();
    await this.logged.page.waitForTimeout(5000); // Wait for the page to load
    const categoryButtons = this.logged.page.locator(".categories_cate-item__bgKcv");
    const countCategoryButtons = await categoryButtons.count();

    // Iterate through each category button to find a match
    for (let i = 0; i < countCategoryButtons; i++) {
      const text = await categoryButtons.nth(i).textContent();
      if (text?.trim() === this.editedcategoryName) {
        const message = `Edited Menu Category Match Found: ${this.editedcategoryName}`;
        this.logged.logToFile(message);
        return message;
      }
    }

    const notFoundMessage = `Edited Menu Category "${this.editedcategoryName}" was not found after deployment.`;
    this.logged.logToFile(notFoundMessage);
    return notFoundMessage;
  }
  
}