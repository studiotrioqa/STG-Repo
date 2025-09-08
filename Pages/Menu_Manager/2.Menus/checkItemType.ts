// Pages/ItemModifiers.ts
import { Page } from "@playwright/test";

// This class handles adding a normal item to a menu category
export class CheckItemType {
    constructor(private page: Page) {}

    async checkItemType() {
        await this.page.waitForTimeout(10000);
        const countItemInMenuCategory = await this.page.locator('#category-item').count();

        for (let i = 0; i < countItemInMenuCategory; i++) {
            // Click each item one by one
            await this.page.locator('#category-item').nth(i).click();
            await this.page.waitForTimeout(3000);

            // Wait for modal to appear
            // const modal = this.page.locator('.modal-selector'); // change selector to your actual modal
            // await modal.waitFor({ state: 'visible' });

            // Check if Ingredient tab is present
            const ingredientTab = this.page.locator('#tabs-edit-menu-item-tab-extras');

            if (await ingredientTab.isVisible()) {
                console.log(`Found Ingredient tab at index ${i}`);
                break; // stop loop once found
            }

            // Close modal if no ingredient tab (adjust selector)
            await this.page.locator('.styles_modal-header-close__LWmuO').click();
        }
    }
}