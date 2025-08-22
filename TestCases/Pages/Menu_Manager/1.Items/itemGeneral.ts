import { Page } from '@playwright/test';

export const addLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');
export const addRandomLetters = Array.from({ length: 3 }, () =>
  addLetters[Math.floor(Math.random() * addLetters.length)]
).join('');

export class ItemGeneral {
  constructor(private loggedPage: Page) {}

  async editFieldsWithRandomLetters(randomLetters: string) {
    const fields = ['Display Name', 'Print Name', 'Description'];
    for (const field of fields) {
      await this.loggedPage.getByRole('textbox', { name: field }).click();
      for (const char of randomLetters) {
        await this.loggedPage.keyboard.press(char);
      }
    }
  }

}
