import { Page, Locator } from '@playwright/test';

export class GoToMenus {
  constructor(private Page: Page) {}

  async clickMenus(): Promise<void> {
    await this.Page.getByRole('tab', { name: 'Menus' }).click();
  }
}