import { Page } from '@playwright/test';

export async function getStoreResolution(page: Page): Promise<string> {
  const viewport = page.viewportSize();
  if (!viewport) {
    throw new Error('Viewport not available');
  }

  const { width, height } = viewport;
  let storeName = '';

  if (width === 1920 && height === 1080) {
    storeName = 'VS Test Store 01';
  } else if (width === 1680 && height === 1050) {
    storeName = 'VS Test Store 02';
    await page.waitForTimeout(1000);
  } else if (width === 1366 && height === 768) {
    storeName = 'VS Test Store 03';
    await page.waitForTimeout(2000);
  } else if (width < 1280) {
    storeName = 'VS Test Store 04';
    await page.waitForTimeout(3000);
  }

  if (!storeName) {
    throw new Error('Unable to determine store name from screen resolution.');
  }

  return storeName;
}
