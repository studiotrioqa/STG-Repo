import {test} from '@playwright/test'
import { screenshotFunc } from '../../TestCases/Utilities/screenshot'; // Import the screenshot function
import {createLogger, createLoggedPage} from '../../TestCases/Utilities/logger.ts'; // Import the logger utilities
import {getStoreResolution} from '../../TestCases/Utilities/getResolution.ts'; // Import the function to get the viewport size
import {stgStudioUrl, stgLoginCredentials, stgDeploymentsUrl} from '../../TestCases/Utilities/getCredentialsAndUrl.ts'; // Import the URLs and login credentials for staging environment
import * as getDeployment from '../../TestCases/Utilities/storeDeployments.ts';

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


  // Select store
  const storeName = await getStoreResolution(loggedPage);
  await loggedPage.locator('#btn-store-selector').nth(0).click();
  await loggedPage.getByRole('searchbox', { name: 'Search' }).fill(storeName);
  await loggedPage.getByRole('button', { name: storeName }).click();
  await loggedPage.waitForTimeout(10000);

  // Check if there's in progress deployment
  await loggedPage.goto(stgDeploymentsUrl);
  await loggedPage.getByRole('checkbox',{ name: 'Only show deployments for'}).check();
  await loggedPage.waitForTimeout(10000);
  await getDeployment.checkDeploymentStatuses(loggedPage, storeName);
  await loggedPage.goto(stgStudioUrl);


});