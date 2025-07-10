import fs from 'fs';
import { Page, TestInfo } from '@playwright/test';


export async function screenshotFunc(page: Page, testInfo: TestInfo) {
  const name = testInfo.title.replace(/[^a-z0-9_\-]/gi, '_');
  const safeProject = testInfo.project.name.replace(/[^\w\d-]/g, "_");
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}-${String(now.getSeconds()).padStart(2, "0")}-${String(now.getMilliseconds()).padStart(3, "0")}`;
  const screenshotPath = `screenshots/${name}-${safeProject}-${timestamp}.jpg`;

  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
  }

  await page.screenshot({ path: screenshotPath });
}