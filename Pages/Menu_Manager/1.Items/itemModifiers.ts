// Pages/ItemModifiers.ts
import { Page, Locator } from '@playwright/test';

export class ItemModifiers {
  constructor(private page: Page) {}

  async clickModifierTab(): Promise<void> {
    await this.page.locator('#tabs-edit-menu-item-tab-item_options').click();
    await this.page.waitForTimeout(3000);
  }

  async addModifiers(count = 3): Promise<void> {
    for (let i = 0; i < count; i++) {
      const modifier = this.page.locator("div.col-2.modal-item-option-right-button > button").first();
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
      const currentModifiers = await this.page.locator(selector).count();
      if (currentModifiers <= minimum) break;

      const modifierToRemove = this.page.locator(selector).first();
      await modifierToRemove.click();

    }
  }
}
