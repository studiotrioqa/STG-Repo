import { chromium } from '@playwright/test';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

async function globalSetup() {
  const storagePath = 'storageState.json';
  const maxAge = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

  // Reuse session if it's fresh
  if (fs.existsSync(storagePath)) {
    const stats = fs.statSync(storagePath);
    const age = Date.now() - stats.mtimeMs;
    if (age < maxAge) {
      return;
    }
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(process.env.STG_STUDIO_URL!);

  await page.getByRole('textbox', { name: 'Email' }).fill(process.env.STG_CUENZ_CREDS_EMAIL!);
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.STG_CUENZ_CREDS_PASSWORD!);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.waitForTimeout(10000); // or wait for page URL to change or selector to appear

  await context.storageState({ path: storagePath });

  await browser.close();
}

export default globalSetup;
