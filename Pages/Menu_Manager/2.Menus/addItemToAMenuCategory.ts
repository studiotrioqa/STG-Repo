// Pages/ItemModifiers.ts
import { Page } from "@playwright/test";

// This class handles adding a normal item to a menu category
export class AddNormalItemToMenuCategory {
    constructor(private page: Page) {}

    async addNormalItemtoMenuCategory(PLU: string): Promise<void> {
        await this.page.locator('div[title].item_card-add__skoxS.card').nth(0).click();
        await this.page.getByRole('searchbox', { name: 'Search PLU / Item Name here' }).fill(PLU);
        await this.page.locator('[data-test-id="virtuoso-item-list"] div').nth(0).click();
    }
}

