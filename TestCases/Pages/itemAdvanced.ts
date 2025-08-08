import { Page } from '@playwright/test';

export class ItemAdvancedEditor {
  constructor(private loggedPage: Page) {}

  async addVisualTag(randomString: string) {
    await this.loggedPage.getByRole('tab', { name: 'Advanced' }).click();
    await this.loggedPage.locator('input[name="visual_tag"]').click();

    for (const char of randomString) {
      await this.loggedPage.keyboard.press(char);
    }
  }
}
