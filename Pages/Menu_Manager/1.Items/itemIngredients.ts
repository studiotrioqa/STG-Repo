// condimentGroupEditor.ts

import { Page } from '@playwright/test';

export class ItemIngredients {
  constructor(private page: Page) {}

  async editExtras(screenshotFunc: (loggedPage: Page, testInfo: any) => Promise<void>, testInfo: any): Promise<void> {

    // Go to Extras tab
    await this.page.locator('#tabs-edit-menu-item-tab-extras').click();
    await screenshotFunc(this.page, testInfo);

    // Remove 3 toppings if visible
    const toppingLabel = this.page.locator("label[for='extras-selected-0']");
    for (let i = 0; i < 3; i++) {
      if (await toppingLabel.isVisible()) {
        await toppingLabel.click();
      }
    }

    // Open and select largest from combobox
    const combo = this.page.getByRole('combobox');
    await combo.click();

    const optionElements = combo.locator('option');
    const texts = await optionElements.allTextContents();

    let maxValue = -1;
    let selectedLabel = '';

    for (const text of texts) {
      const match = text.match(/\((\d+)\)/);
      if (match) {
        const num = parseInt(match[1]);
        if (num > maxValue) {
          maxValue = num;
          selectedLabel = text;
        }
      }
    }

    if (selectedLabel) {
      await combo.selectOption({ label: selectedLabel });
    }

    // Select 5 extras sequentially
    for (let i = 0; i < 5; i++) {
      const locator = this.page.locator(`label[for='extras-${i}']`);
      await locator.click();
    }

    await screenshotFunc(this.page, testInfo);
  }
}
