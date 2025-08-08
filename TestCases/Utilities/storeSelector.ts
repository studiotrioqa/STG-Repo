import { Page } from '@playwright/test';

// Returns the store name based on viewport resolution
export async function getStoreNameByResolution(loggedPage: Page): Promise<string> {
  const viewport = loggedPage.viewportSize();
  if (!viewport) throw new Error('Viewport not available');

  const { width, height } = viewport;

  if (width === 1920 && height === 1080) {
    return 'VS Test Store 01';
  } else if (width === 1680 && height === 1050) {
    await loggedPage.waitForTimeout(1000);
    return 'VS Test Store 02';
  } else if (width === 1366 && height === 768) {
    await loggedPage.waitForTimeout(2000);
    return 'VS Test Store 03';
  } else if (width < 1280) {
    await loggedPage.waitForTimeout(3000);
    return 'VS Test Store 04';
  }

  throw new Error('Unable to determine store name from screen resolution.');
}

// Selects the store in the UI using the detected store name
export async function selectStore(loggedPage: Page): Promise<string> {
  const storeName = await getStoreNameByResolution(loggedPage);

  await loggedPage.locator('#btn-store-selector').first().click();
  await loggedPage.getByRole('searchbox', { name: 'Search' }).fill(storeName);
  await loggedPage.getByRole('button', { name: storeName }).click();
  await loggedPage.waitForTimeout(10000);

  return storeName;
}
