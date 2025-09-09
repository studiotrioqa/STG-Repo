import { Page } from '@playwright/test';

export class ItemAdvancedEditor {
  constructor(private page: Page) {}

  async navigateToAdvancedTab() {
    await this.page.getByRole('tab', { name: 'Advanced' }).click();
  }

  async addVisualTag(randomString: string) {
    await this.page.locator('input[name="visual_tag"]').click();

    for (const char of randomString) {
      await this.page.keyboard.press(char);
    }
  }

  async IconsSelector() {
    const iconsSection = this.page.locator('.update-item-modal_advanced-section__ZAUWX').nth(3);
    await iconsSection.waitFor();

    const iconToggles = await iconsSection.locator('input[type="checkbox"]');

    const count = await iconToggles.count();
    
    // Uncheck all icons first to start clean (max 3 only)
    for (let i = 0; i < count; i++) {
      if (await iconToggles.nth(i).isChecked()) {
        await iconToggles.nth(i).click();
      }
    }

    // Randomly select 3 unique indices
    const selectedIndices = new Set<number>();
    while (selectedIndices.size < 3) {
      selectedIndices.add(Math.floor(Math.random() * count));
    }

    // Select the 3 randomly chosen icons
    for (const index of selectedIndices) {
      const toggle = iconToggles.nth(index);
      if (!(await toggle.isChecked())) {
        await toggle.click();
      }
    }

  }
}
