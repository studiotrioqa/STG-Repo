import { Page } from '@playwright/test';
import { LoggedPage } from '../../../Utilities/logger';

export class CreateMenuset {

  constructor(private logged: LoggedPage) {}

  async createMenuset(screenshotFunc: (loggedPage: Page, testInfo: any) => Promise<void>, testInfo: any): Promise<string> {
    await this.logged.page.getByRole('button', { name: 'Add Menu Set' }).click();
    const menusetName = "Menuset-" + this.logged.timestamp;
    await this.logged.page.getByRole('textbox').fill(menusetName);
    await screenshotFunc(this.logged.page, testInfo);
    await this.logged.page.getByRole('button', { name: 'Add', exact: true }).click();
    await this.logged.page.waitForTimeout(15000);
    await this.logged.page.reload();
    return menusetName; // Return the created menusetName
  }

  async checkifMenusetExists(menusetName: string): Promise<string> {
    await this.logged.page.locator('#dropdown-integration-selector').click();
    await this.logged.page.waitForTimeout(3000);

    const menusetLocators = this.logged.page.locator('div.menuset_integrations__nqh0Y');
    const count = await menusetLocators.count();
    
    for (let i = 0; i < count; i++) {
      const text = await menusetLocators.nth(i).textContent();
      if (text?.trim() === menusetName) {
        const message = `Menuset Match Found: ${menusetName}`;
        this.logged.logToFile(message);
        return message;
      }
    }
    
    const message = `Menuset Not Found: ${menusetName}`;
    this.logged.logToFile(message);
    return message;
  }

    
}