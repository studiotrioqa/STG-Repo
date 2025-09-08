// Pages/ItemModifiers.ts
import { Page } from "@playwright/test";
import { LoggedPage } from "../../../Utilities/logger";

export class AddMenuCategory {
  constructor(private logged: LoggedPage) {}

  async addMenuCategory(screenshotFunc: (loggedPage: Page, testInfo: any) => Promise<void>,testInfo: any): Promise<string> {
    await this.logged.page.getByTitle("Add Categories").click();
    const menuCategoryName = "MC-" + this.logged.timestamp;
    await this.logged.page.getByRole("textbox").fill(menuCategoryName);
    await this.logged.page
      .getByRole("button", { name: "Add", exact: true })
      .click();
    await this.logged.page.waitForTimeout(10000);
    await this.logged.page.reload();

    const categoryButtons = this.logged.page.locator(".categories_cate-item__bgKcv");
    const countCategoryButtons = await categoryButtons.count();

    for (let i = 0; i < countCategoryButtons; i++) {
      const text = await categoryButtons.nth(i).textContent();
      if (text?.trim() === menuCategoryName) {
        const message = `Menu Category Match Found: ${menuCategoryName}`;
        this.logged.logToFile(message);
        return message;
      }
    }

    const notFoundMessage = `Menu Category "${menuCategoryName}" was not found after creation.`;
    this.logged.logToFile(notFoundMessage);  // ✅ Log the failure too
    return notFoundMessage;
  }
}