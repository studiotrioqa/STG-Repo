import { Page } from '@playwright/test';

export async function addModifiers(page: Page) {
  for (let i = 0; i < 3; i++) {
    const modifier = page.locator("div.col-2.modal-item-option-right-button > button").nth(0);
    if (await modifier.count() > 0 && await modifier.isVisible()) {
      await modifier.click();
    } else {
      break;
    }
  }
}

export async function removeModifiers(page: Page) {
  while (true) {
    const currentModifiers = await page.locator("div.col-2.modal-item-option-left-button > button").count();
    if (currentModifiers <= 3) break;

    const modifierToRemove = page.locator("div.col-2.modal-item-option-left-button > button").nth(0);
    await modifierToRemove.click();
  }
}
