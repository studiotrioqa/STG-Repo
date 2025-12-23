import { chromium, expect } from '@playwright/test';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

async function globalSetup() {
  const storagePath = 'storageState.json';
  const maxAge = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

  // Reuse session if it's fresh and valid
  if (fs.existsSync(storagePath)) {
    const stats = fs.statSync(storagePath);
    const age = Date.now() - stats.mtimeMs;
    if (age < maxAge) {
      console.log('Using existing session (age: ' + Math.round(age / 1000) + 's)');
      return;
    }
    console.log('Session expired, creating new login...');
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Performing login...');
    await page.goto(process.env.STG_STUDIO_URL!, {
      waitUntil: 'domcontentloaded',
    });

    // Wait for email input to be visible
    await page.waitForSelector('input[type="email"]', { timeout: 15000 });

    // Fill login credentials
    await page.fill('input[type="email"]', process.env.STG_CUENZ_CREDS_EMAIL!);
    await page.fill('input[type="password"]', process.env.STG_CUENZ_CREDS_PASSWORD!);

    // Click sign in button
    await page.click('button:has-text("Sign in")');

    // Wait for navigation to complete
    await page.waitForURL('**/menu-manager/items', { timeout: 30000 });
    await page.waitForLoadState('networkidle');

    console.log('Login successful, saving state...');
    await context.storageState({ path: storagePath });
  } catch (error) {
    console.error('Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
