import { Page } from '@playwright/test';

export class ItemAdvancedEditor {
  constructor(private page: Page) {}

  async addVisualTag(randomString: string) {
    await this.page.getByRole('tab', { name: 'Advanced' }).click();
    await this.page.locator('input[name="visual_tag"]').click();

    for (const char of randomString) {
      await this.page.keyboard.press(char);
    }
  }
}
