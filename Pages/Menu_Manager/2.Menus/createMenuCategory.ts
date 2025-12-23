// Pages/ItemModifiers.ts
import { Page } from "@playwright/test";

export class AddMenuCategory {
  constructor(private page: Page, private timestamp: string = '') {}

  async addMenuCategory(testInfo: any): Promise<string> {
    await this.page.getByTitle("Add Categories").click();
    const menuCategoryName = "MC-" + this.timestamp;
    await this.page.getByRole("textbox").fill(menuCategoryName);
    await this.page
      .getByRole("button", { name: "Add", exact: true })
      .click();
    // await this.page.waitForTimeout(10000);
    await this.page.reload();

    const categoryButtons = this.page.locator(".categories_cate-item__bgKcv");
    const countCategoryButtons = await categoryButtons.count();
    // Iterate through each category button to find a match
    for (let i = 0; i < countCategoryButtons; i++) {
      const text = await categoryButtons.nth(i).textContent();
      if (text?.trim() === menuCategoryName) {
        const message = `Menu Category Match Found: ${menuCategoryName}`;
        console.log(message);
        return message;
      }
    }

    const notFoundMessage = `Menu Category "${menuCategoryName}" was not found after creation.`;
    console.log(notFoundMessage);
    return notFoundMessage;
  }
}