// Pages/ItemModifiers.ts
import { Page, Locator } from '@playwright/test';
import { LoggedPage } from '../../../Utilities/logger';

export class DuplicateMenuset {
  constructor(private logged: LoggedPage) {}
  
  async duplicateMenuset(screenshotFunc: (page: Page, testInfo: any) => Promise<void>, testInfo: any): Promise<string> {
    await this.logged.page.locator('#dropdown-integration-selector').click();
    const menusetLocators = this.logged.page.locator('a.menuset_menuset-d-item__L9m_J');
    const count = await menusetLocators.count();
    
    // Generate random index based on count
    const randomIndex = Math.floor(Math.random() * count);
    
    // Use the random index for nth selection
    await this.logged.page.locator('.menuset_menuset-d-menu-scrollable__8o5DJ a').nth(randomIndex).click();
    await this.logged.page.locator('div:nth-child(2) > .menuManager_menu-manager-table-header__szPQ4 > .menuManager_m-btn__KuXMP > .menuManager_m-btn-icon__3gP2e > path').first().click();
    await this.logged.page.waitForTimeout(10000);
    
    const dmName = "DM-" + this.logged.timestamp; // Now using timestamp from LoggedPage
    await this.logged.page.getByRole('textbox').fill(dmName);
    await screenshotFunc(this.logged.page, testInfo);
    await this.logged.page.getByRole('button', { name: 'Add', exact: true }).click();
    await this.logged.page.waitForTimeout(15000);
    await this.logged.page.reload();
    return dmName;
  }
}