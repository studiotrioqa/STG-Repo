import { Page } from '@playwright/test';

// Remove a topping by clicking on the label associated with the topping, 3 times if necessary
export async function removeTopping(page: Page, index: number) {
const locator = page.locator("label[for='extras-selected-0']");

for (let i = 0; i < 3; i++) {
  if (await locator.isVisible()) {
    await locator.click();
  }
  // If not visible, skip silently
}
}

export async function selectLargestOption(page: Page) {
  const combo = page.getByRole('combobox');
  const optionElements = combo.locator('option');
  const texts = await optionElements.allTextContents();

  let maxValue = -1;
  let selectedLabel = '';

  for (const text of texts) {
    const match = text.match(/\((\d+)\)/);
    if (match) {
      const num = parseInt(match[1]);
      if (num > maxValue) {
        maxValue = num;
        selectedLabel = text;
      }
    }
  }

  if (selectedLabel) {
    await combo.selectOption({ label: selectedLabel });
  }
}

export async function clickExtrasSequentially(page: Page) {
  for (let i = 0; i < 5; i++) {
    const locator = page.locator(`label[for='extras-${i}']`);
    await locator.click();
  }
}