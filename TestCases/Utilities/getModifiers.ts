import { Page } from '@playwright/test';

export async function addModifiers(loggedPage: Page) {
  for (let i = 0; i < 3; i++) {
    const modifier = loggedPage.locator("div.col-2.modal-item-option-right-button > button").nth(0);
    if (await modifier.count() > 0 && await modifier.isVisible()) {
      await modifier.click();
    } else {
      break;
    }
  }
}

export async function removeModifiers(loggedPage: Page) {
  while (true) {
    const currentModifiers = await loggedPage.locator("div.col-2.modal-item-option-left-button > button").count();
    if (currentModifiers <= 3) break;

    const modifierToRemove = loggedPage.locator("div.col-2.modal-item-option-left-button > button").nth(0);
    await modifierToRemove.click();
  }
}
