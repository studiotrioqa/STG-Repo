import { Page } from '@playwright/test';

export class CreateMenuset {

  constructor(private page: Page, private timestamp: string = '') {}

  async createMenuset(testInfo: any): Promise<string> {
    await this.page.getByRole('button', { name: 'Add Menu Set' }).click();
    const menusetName = "Menuset-" + this.timestamp;
    await this.page.getByRole('textbox').fill(menusetName);
    await this.page.getByRole('button', { name: 'Add', exact: true }).click();
    await this.page.waitForTimeout(15000);
    await this.page.reload();
    return menusetName; // Return the created menusetName
  }

  async checkifMenusetExists(menusetName: string): Promise<string> {
    await this.page.locator('#dropdown-integration-selector').click();
    await this.page.waitForTimeout(3000);

    const menusetLocators = this.page.locator('a.menuset_menuset-d-item__L9m_J');
    const count = await menusetLocators.count();
    
    for (let i = 0; i < count; i++) {
      const text = await menusetLocators.nth(i).textContent();
      if (text?.trim() === menusetName) {
        const message = `Menuset Match Found: ${menusetName}`;
        console.log(message);
        return message;
      }
    }
    
    const message = `Menuset Not Found: ${menusetName}`;
    console.log(message);
    return message;
  }
}