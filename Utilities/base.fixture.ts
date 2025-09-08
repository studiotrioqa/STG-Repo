// base.fixture.ts
import { test as base } from '@playwright/test';

export const test = base.extend({});

test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => {
    const type = route.request().resourceType();
    if (['image', 'font', 'media'].includes(type)) {
      return route.abort();
    }
    return route.continue();
  });
});

export { expect } from '@playwright/test';
