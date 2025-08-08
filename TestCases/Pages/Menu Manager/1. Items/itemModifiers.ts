// Pages/ItemModifiers.ts
import { Page, Locator } from '@playwright/test';

export class ItemModifiers {
  constructor(private loggedPage: Page) {}

  async searchPLU(plu: string): Promise<void> {
    await this.loggedPage.getByRole('textbox', { name: 'Search PLU / Item Name here' }).click();
    await this.loggedPage.getByRole('textbox', { name: 'Search PLU / Item Name here' }).fill(plu);
    await this.loggedPage.locator('xpath=//div[@id="row-0"]').first().click();
  }

  async clickModifierTab(): Promise<void> {
    await this.loggedPage.locator('#tabs-edit-menu-item-tab-item_options').click();
    await this.loggedPage.waitForTimeout(3000);
  }

  async addModifiers(count = 3): Promise<void> {
    for (let i = 0; i < count; i++) {
      const modifier = this.loggedPage.locator("div.col-2.modal-item-option-right-button > button").first();
      if (await modifier.count() > 0 && await modifier.isVisible()) {
        await modifier.click();
      } else {
        break;
      }
    }
  }

  async removeModifiers(minimum = 3): Promise<void> {
    const selector = "div.col-2.modal-item-option-left-button > button";
    while (true) {
      const currentModifiers = await this.loggedPage.locator(selector).count();
      if (currentModifiers <= minimum) break;

      const modifierToRemove = this.loggedPage.locator(selector).first();
      await modifierToRemove.click();

    }
  }
}
