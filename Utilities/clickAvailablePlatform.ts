import { Page } from '@playwright/test';

// Click on the input field for platform availability sample
export async function clickPlatformAvailable(page: Page) {
  const inputs = page.locator('div.multiPrice_integration-container__2Olqz > div > div > input');
  const count = await inputs.count();

  for (let i = 0; i < count; i++) {
    const input = inputs.nth(i);
    const isDisabled = await input.isDisabled();

    if (!isDisabled) {
      console.log(`Clicking enabled input at index ${i}`);
      await input.click();
    } else {
      console.log(`Skipping disabled input at index ${i}`);
    }
  }
}