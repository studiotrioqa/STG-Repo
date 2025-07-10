import {test} from '@playwright/test'
import { screenshotFunc } from '../../TestCases/Utilities/screenshot'; // Import the screenshot function
import {addRandomLetters} from  '../../TestCases/Utilities/getAddDeleteChar.ts'; // Import the function to get a random character to add or delete 
import {PLU} from '../../TestCases/Utilities/getPLU.ts'; // Import the function to get a random PLU
import {getOperation, addPrice} from '../../TestCases/Utilities/getOperation.ts'; // Import the function to get a random operation to perform on the price of the items.
import {createLogger, createLoggedPage} from '../../TestCases/Utilities/logger.ts'; // Import the logger utilities
import {getStoreResolution} from '../../TestCases/Utilities/getResolution.ts'; // Import the function to get the viewport size
import {stgStudioUrl, stgLoginCredentials, stgDeploymentsUrl} from '../../TestCases/Utilities/getCredentialsAndUrl.ts'; // Import the URLs and login credentials for staging environment
import * as getCondimentGroup from '../../TestCases/Utilities/getCondimentGroup.ts';
import * as getModifiers from '../../TestCases/Utilities/getModifiers.ts'; // Import the function to get the modifiers
import { clickMatchingCell } from '../../TestCases/Utilities/getDeployment.ts'; // Import the function to click on the matching cell in the deployment page

test.setTimeout(120000); // Set timeout to 2 minutes for the entire test suite.

test('Single Item - General Info', async ({page}, testInfo) => {
  const { logToFile, deploymentName } = createLogger(testInfo.title, testInfo.project.name);
  const loggedPage = createLoggedPage(page, logToFile);
  await loggedPage.goto(stgStudioUrl);

  // Login to STUDIO
  await loggedPage.getByRole('textbox', { name: 'Email' }).click();
  await loggedPage.getByRole('textbox', { name: 'Email' }).fill(stgLoginCredentials.email);
  await loggedPage.getByRole('textbox', { name: 'Password' }).click();
  await loggedPage.getByRole('textbox', { name: 'Password' }).fill(stgLoginCredentials.password);
  await loggedPage.getByRole('button', { name: 'Sign in' }).click();
  await loggedPage.waitForTimeout(10000);

  // Select store
  await loggedPage.locator('#btn-store-selector').nth(0).click();
  await loggedPage.getByRole('searchbox', { name: 'Search' }).click();
  const storeName = await getStoreResolution(loggedPage);
  if (storeName) {
    await loggedPage.getByRole('button', { name: storeName }).click();
  }

  await loggedPage.waitForTimeout(10000);

  // Selecting Item
  await loggedPage.getByRole('textbox', {name: 'Search PLU / Item Name here'}).click();
  await loggedPage.getByRole('textbox', {name: 'Search PLU / Item Name here'}).fill(PLU);
  await loggedPage.locator('xpath=//div[@id="row-0"]').nth(0).click();

  // add 3 random characters to display name, print name, and description
  await loggedPage.getByRole('textbox', { name: 'Display Name' }).click();
  for (const char of addRandomLetters) {
    await loggedPage.keyboard.press(char);
  }
  await loggedPage.getByRole('textbox', { name: 'Print Name' }).click();
  for (const char of addRandomLetters) {
    await loggedPage.keyboard.press(char);
  }
  await loggedPage.getByRole('textbox', { name: 'Description' }).click();
  for (const char of addRandomLetters) {
    await loggedPage.keyboard.press(char);
  }

  await screenshotFunc(loggedPage, testInfo);
  await loggedPage.getByRole('button', { name: 'Save' }).click();
  await loggedPage.waitForTimeout(10000);

  // Deploy
  await loggedPage.locator('xpath=//button[@id="deploy-button"]').click();
  await loggedPage.getByRole('button', { name: 'Next' }).click();
  await loggedPage.getByRole('button', { name: 'Next' }).click();
  await loggedPage.getByRole('button', { name: 'Deploy (1)' }).click();
  await loggedPage.getByRole('button').filter({ hasText: /^$/}).click();
  await loggedPage.getByRole('textbox').press('ControlOrMeta+a');
  await loggedPage.getByRole('textbox').fill(deploymentName);
  await loggedPage.getByRole('button').filter({ hasText: /^$/ }).click();
  const storeDeploymentName = await page.getByRole('textbox').inputValue();
  await loggedPage.getByRole('button', { name: 'Continue Deploy' }).click();
  await loggedPage.waitForTimeout(5000);

  // Go to Deployments Page
  await loggedPage.goto(stgDeploymentsUrl);
  await loggedPage.waitForTimeout(10000);
  clickMatchingCell(loggedPage, storeDeploymentName);
  await loggedPage.waitForTimeout(5000);
  await loggedPage.locator('span.styles_id-value__MH_QF').textContent();
});