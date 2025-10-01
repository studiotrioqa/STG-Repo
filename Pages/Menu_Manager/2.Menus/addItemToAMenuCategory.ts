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
        const PLUGroupItemName = ['GP02', 'GP03', 'GP04', 'GP05', 'GP06', 'GP07', 'GP08', 'GP09', 'GP10'];

        await this.page.locator('div[title].item_card-add__skoxS.card').nth(0).click();
        await this.page.getByRole('searchbox', { name: 'Search PLU / Item Name here' }).fill("GP01");
        await this.page.waitForTimeout(1000); // Wait for search results to load    

        const getGroupItemTr = this.page.locator('tbody[data-test-id="virtuoso-item-list"] tr');
        let countGroupItemTr = await getGroupItemTr.count();
        
        // check if there are any items found using for loop
        if (countGroupItemTr === 0) {
            for (let i = 0; i < PLUGroupItemName.length; i++) {
                await this.page.getByRole('searchbox', { name: 'Search PLU / Item Name here' }).click();
                await this.page.getByRole('searchbox', { name: 'Search PLU / Item Name here' }).press('Control+A');
                await this.page.getByRole('searchbox', { name: 'Search PLU / Item Name here' }).fill(PLUGroupItemName[i]);
                await this.page.waitForTimeout(1000);
                const getGroupItemTr = this.page.locator('tbody[data-test-id="virtuoso-item-list"] tr');
                let countGroupItemTr = await getGroupItemTr.count();
                if (countGroupItemTr > 0) break; // exit the loop if items are found
                for (let i = 0; i < countGroupItemTr; i++) {
                    await getGroupItemTr.nth(i).click();
                }
            }
        }
        
        // If no items found, try a different random PLU until one is found
        // Limit the number of attempts to avoid infinite loops
        // for (let attempt = 0; attempt < 9 && countGroupItemTr === 0; attempt++) {
        //     console.warn(`No items found for "${searchPLU}", trying another random PLU.`);
        //     await this.page.getByRole('searchbox', { name: 'Search PLU / Item Name here' }).click();
        //     await this.page.getByRole('searchbox', { name: 'Search PLU / Item Name here' }).press('Control+A');
        //     const newPLU = PLUGroupItemName + PLUNumber[Math.floor(Math.random() * PLUNumber.length)];
        //     await this.page.getByRole('searchbox', { name: 'Search PLU / Item Name here' }).fill(newPLU);
        //     await this.page.waitForTimeout(1000);
        // }
        // if (countGroupItemTr === 0) {
        //     console.warn(`No items found for "${searchPLU}", trying another random PLU.`);
        //     const newPLU = PLUGroupItemName + PLUNumber[Math.floor(Math.random() * PLUNumber.length)];
        //     await this.page.getByRole('searchbox', { name: 'Search PLU / Item Name here' }).fill(newPLU);
        //     countGroupItemTr = await getGroupItemTr.count();
        // }

        // for (let i = 0; i < countGroupItemTr; i++) {
        //     await getGroupItemTr.nth(i).click();
        // }

        await this.page.getByRole('checkbox', { name: 'Auto Group' }).check();
    }


}

