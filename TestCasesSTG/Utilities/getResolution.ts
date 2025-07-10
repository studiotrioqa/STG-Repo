import { Page } from '@playwright/test';

export async function getStoreResolution(page: Page): Promise<string | undefined> {
  const viewport = page.viewportSize();
  if (!viewport) return;

  const { width, height } = viewport;
  let storeName = '';

  if (width === 1920 && height === 1080) {
    storeName = 'VS Test Store 01';
  } else if (width === 1680 && height === 1050) {
    storeName = 'VS Test Store 02';
    page.waitForTimeout(1000);
  } else if (width === 1366 && height === 768) {
    storeName = 'VS Test Store 03';
    page.waitForTimeout(2000);
  } else if (width < 1280) {
    storeName = 'VS Test Store 04';
    page.waitForTimeout(3000);
  }

  if (storeName) {
    await page.getByRole('searchbox', { name: 'Search' }).fill(storeName);
    return storeName;
  }

  return undefined;
}