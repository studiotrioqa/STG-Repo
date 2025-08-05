import { Page } from '@playwright/test';

export const addLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');
export const addRandomLetters = Array.from({ length: 3 }, () =>
  addLetters[Math.floor(Math.random() * addLetters.length)]
).join('');

export class ItemEditor {
  constructor(private loggedPage: Page) {}

  async selectItem(PLU: string) {
    await this.loggedPage.getByRole('textbox', { name: 'Search PLU / Item Name here' }).click();
    await this.loggedPage.getByRole('textbox', { name: 'Search PLU / Item Name here' }).fill(PLU);
    await this.loggedPage.locator('xpath=//div[@id="row-0"]').nth(0).click();
  }

  async editFieldsWithRandomLetters(randomLetters: string) {
    const fields = ['Display Name', 'Print Name', 'Description'];
    for (const field of fields) {
      await this.loggedPage.getByRole('textbox', { name: field }).click();
      for (const char of randomLetters) {
        await this.loggedPage.keyboard.press(char);
      }
    }
  }

  async saveAndScreenshot(screenshotFunc: (page: Page, testInfo: any) => Promise<void>, testInfo: any) {
    await screenshotFunc(this.loggedPage, testInfo);
    await this.loggedPage.getByRole('button', { name: 'Save' }).click();
    await this.loggedPage.waitForTimeout(10000);
  }
}
