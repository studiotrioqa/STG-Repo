import { Page } from '@playwright/test';

// Returns the store name based on viewport resolution
export async function getStoreNameByResolution(page: Page): Promise<string> {
  const viewport = page.viewportSize();
  if (!viewport) throw new Error('Viewport not available');

  const { width, height } = viewport;

  if (width === 1920 && height === 1080) {
    return 'VS Test Store 01';
  } else if (width === 1680 && height === 1050) {
    await page.waitForTimeout(1000);
    return 'VS Test Store 02';
  } else if (width === 1366 && height === 768) {
    await page.waitForTimeout(2000);
    return 'VS Test Store 03';
  } else if (width < 1280) {
    await page.waitForTimeout(3000);
    return 'VS Test Store 04';
  }

  throw new Error('Unable to determine store name from screen resolution.');
}

// Clicks the "Change Store" button if it is visible
export async function clickChangeStoreIfVisible(page: Page): Promise<void> {
  const changeStoreBtn = page.getByRole('button', { name: 'Change Store' });
  if (await changeStoreBtn.isVisible()) {
    await changeStoreBtn.click();
  }
}

// Selects the store in the UI using the detected store name
export async function selectStore(page: Page): Promise<string> {
  const storeName = await getStoreNameByResolution(page);

  await page.locator('#btn-store-selector').first().click();
  await page.getByRole('searchbox', { name: 'Search' }).fill(storeName);
  await page.getByRole('button', { name: storeName }).click();
  await page.waitForTimeout(10000);

  return storeName;
}
