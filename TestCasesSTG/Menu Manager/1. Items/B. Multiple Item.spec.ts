import {test} from '@playwright/test'
import {screenshotFunc} from '../../Utilities/screenshot'; // Import the screenshot function
import {addRandomLetters} from  '../../Utilities/getAddDeleteChar'; // Import the function to get a random character to add or delete
import {PLUName,PLU, randomlySelectPLU} from '../../Utilities/getPLU.ts'; // Import the function to get a random PLU
import {getOperation, addPrice} from '../../Utilities/getOperation'; // Import the function to get a random operation to perform on the price of the item
import {createLogger, createLoggedPage} from '../../Utilities/logger'; // Import the logger utilities
import {getStoreResolution} from '../../Utilities/getResolution'; // Import the function to get the viewport size
import {stgStudioUrl, stgLoginCredentials, stgDeploymentsUrl} from '../../Utilities/getCredentialsAndUrl'; // Import the URLs and login credentials for staging environment
import * as getCondimentGroup from '../../Utilities/getCondimentGroup';
import * as getModifiers from '../../Utilities/getModifiers'; // Import the function to get the modifiers
import { clickMatchingCell } from '../../Utilities/getDeployment'; // Import the function to click on the matching cell in the deployment page
import { log } from 'console';
import { clickPlatformAvailable } from '../../Utilities/clickAvailablePlatform'; // Import the function to click on the available platform

test.setTimeout(120000); // Set timeout to 2 minutes for the entire test suite

test('Multiple Item - Update Price', async ({page}, testInfo) => {
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

  // Selecting Multiple Item
  await loggedPage.getByRole('textbox', {name: 'Search PLU / Item Name here'}).click();
  await loggedPage.getByRole('textbox', {name: 'Search PLU / Item Name here'}).fill(PLUName);
  await loggedPage.getByTitle('Multi Select').click();
  await randomlySelectPLU(loggedPage);
  await loggedPage.getByRole('button', {name: 'Multi Item Change'}).click();
  await loggedPage.waitForTimeout(10000);
  await loggedPage.getByRole('tabpanel', {name: 'Price'}).getByRole('textbox').click();
  await loggedPage.getByRole('tabpanel', { name: 'Price' }).getByRole('textbox').press('ControlOrMeta+a');
  await loggedPage.getByRole('tabpanel', { name: 'Price' }).getByRole('textbox').fill(addPrice.toString());
  await clickPlatformAvailable(loggedPage);

  // Save
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


//   await page.getByRole('row', { name: 'Item Image $10 Discount - MKTAMPLOST6 $ 0 $' }).locator('#cell-display_name-undefined').click();
//   await page.getByRole('row', { name: 'Item Image $10 Discount - MKTAMP2ND6 $ -10 $ -' }).locator('#cell-display_name-undefined').click();
//   await page.getByRole('button', { name: 'Multi Item Change' }).click();
//   await page.getByRole('tabpanel', { name: 'Price' }).getByRole('textbox').click();
//   await page.getByRole('tabpanel', { name: 'Price' }).getByRole('textbox').press('ControlOrMeta+a');
//   await page.getByRole('tabpanel', { name: 'Price' }).getByRole('textbox').fill('12');
//   await page.locator('div').filter({ hasText: /^DPOS$/ }).locator('#chk-out-of-stock').check();
//   await page.locator('div').filter({ hasText: /^Online Ordering$/ }).locator('#chk-out-of-stock').check();
  
  

});