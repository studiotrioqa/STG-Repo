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

export class AddGroupItemToMenuCategory {
    constructor(private page: Page) {}

    // Method to add a group item to a menu category
    async addGroupItemtoMenuCategory(groupPLU?: string): Promise<void> {
        const PLUNumber = ['01','02','03','04','05','06','07','08','09','10'];
        const PLUGroupItemName = 'GP';
        const randomGroupPLU = PLUGroupItemName + PLUNumber[Math.floor(Math.random() * PLUNumber.length)];
        const searchPLU = groupPLU ?? randomGroupPLU;

        await this.page.locator('div[title].item_card-add__skoxS.card').nth(0).click();
        await this.page.getByRole('searchbox', { name: 'Search PLU / Item Name here' }).fill(searchPLU);
        await this.page.waitForTimeout(1000); // Wait for search results to load    

        const getGroupItemTr = this.page.locator('tbody[data-test-id="virtuoso-item-list"] tr');
        let countGroupItemTr = await getGroupItemTr.count();
        
        // If no items found, try a different random PLU
        if (countGroupItemTr === 0) {
            console.warn(`No items found for "${searchPLU}", trying another random PLU.`);
            const newPLU = PLUGroupItemName + PLUNumber[Math.floor(Math.random() * PLUNumber.length)];
            await this.page.getByRole('searchbox', { name: 'Search PLU / Item Name here' }).fill(newPLU);
            countGroupItemTr = await getGroupItemTr.count();
        }

        for (let i = 0; i < countGroupItemTr; i++) {
            await getGroupItemTr.nth(i).click();
        }

        await this.page.getByRole('checkbox', { name: 'Auto Group' }).check();
    }


}

