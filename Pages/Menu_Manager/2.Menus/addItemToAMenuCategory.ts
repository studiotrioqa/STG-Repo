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
        // check if there are any items found using for loop
        if (countGroupItemTr === 0) {
            for (let i = 0; i < PLUGroupItemName.length; i++) {
                await this.page.getByRole('searchbox', { name: 'Search PLU / Item Name here' }).click();
                await this.page.getByRole('searchbox', { name: 'Search PLU / Item Name here' }).press('Control+A');
                await this.page.getByRole('searchbox', { name: 'Search PLU / Item Name here' }).fill(PLUGroupItemName[i]);
                await this.page.waitForTimeout(1000);

                const getGroupItemTr = this.page.locator('tbody[data-test-id="virtuoso-item-list"] tr');
                let countGroupItemTr = await getGroupItemTr.count();

                if (countGroupItemTr > 0) {
                    for (let j = 0; j < countGroupItemTr; j++) {
                        await getGroupItemTr.nth(j).click();
                    }
                    break; // exit the PLU loop after clicking all found items
                }
            }

        }

        await this.page.getByRole('checkbox', { name: 'Auto Group' }).check();
    }






}

