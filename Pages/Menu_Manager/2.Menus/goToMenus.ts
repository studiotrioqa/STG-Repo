import { Page, Locator } from '@playwright/test';

export class GoToMenus {
  constructor(private page: Page) {} // changed property name to 'page'

  async clickMenus(): Promise<void> {
    await this.page.getByRole('tab', { name: 'Menus' }).click();
  }
}