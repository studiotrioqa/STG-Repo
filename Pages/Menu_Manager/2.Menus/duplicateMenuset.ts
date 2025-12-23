// Pages/ItemModifiers.ts
import { Page } from '@playwright/test';

export class DuplicateMenuset {
  constructor(private page: Page, private timestamp: string = '') {}
  
  async duplicateMenuset(testInfo: any): Promise<string> {
    await this.page.locator('#dropdown-integration-selector').click();
    const menusetLocators = this.page.locator('a.menuset_menuset-d-item__L9m_J');
    const count = await menusetLocators.count();
    
    // Generate random index based on count
    const randomIndex = Math.floor(Math.random() * count);
    
    // Use the random index for nth selection
    await this.page.locator('.menuset_menuset-d-menu-scrollable__8o5DJ a').nth(randomIndex).click();
    await this.page.locator('div:nth-child(2) > .menuManager_menu-manager-table-header__szPQ4 > .menuManager_m-btn__KuXMP > .menuManager_m-btn-icon__3gP2e > path').first().click();
    await this.page.waitForTimeout(10000);
    
    const dmName = "DM-" + this.timestamp;
    await this.page.getByRole('textbox').fill(dmName);
    await this.page.getByRole('button', { name: 'Add', exact: true }).click();
    await this.page.waitForTimeout(15000);
    await this.page.reload();
    console.log(`Duplicated menuset as ${dmName}`);
    return dmName;
  }
}