import { Page } from "@playwright/test";
import { LoggedPage } from "../../../Utilities/logger";

export class EditMenuCategoryName {
  constructor(private logged: LoggedPage) {}

  async addMenuCategory(testInfo: any): Promise<string>  {
    const editMenuCategoryName = "EMC-" + this.logged.timestamp; // Unique name using timestamp
    await this.logged.page.locator('span[title="Edit Title"]').first().click();
    await this.logged.page.locator('.category_title-input__QTxqx').press('Control+A');
    await this.logged.page.locator('.category_title-input__QTxqx').fill(editMenuCategoryName);
    await this.logged.page.locator('.category_title-input__QTxqx').press('Enter');
    await this.logged.page.waitForTimeout(3000);
    return editMenuCategoryName;
  }
}