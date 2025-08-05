import { test } from '@playwright/test'
import { LoginPage } from '../../TestCases/Pages/login.ts';
import { StoreSelector } from '../../TestCases/Pages/storeSelector.ts'; // Import the function to get the viewport size
import { DeploymentChecker } from '../../TestCases/Pages/deploymentChecker.ts';
import { screenshotFunc } from '../../TestCases/Utilities/screenshot.ts'; // Import the screenshot function  sample edit
import { addRandomLetters } from  '../../TestCases/Utilities/getAddDeleteChar.ts'; // Import the function to get a random character to add or delete 
import { PLU } from '../../TestCases/Utilities/getPLU.ts'; // Import the function to get a random PLU
import { getOperation, addPrice } from '../../TestCases/Utilities/getOperation.ts'; // Import the function to get a random operation to perform on the price of the items.
import { LoggedPage } from '../../TestCases/Utilities/logger.ts'; // Import the logger utilities
import { stgStudioUrl, stgLoginCredentials, stgDeploymentsUrl } from '../../TestCases/Utilities/getCredentialsAndUrl.ts'; // Import the URLs and login credentials for staging environment
import * as getCondimentGroup from '../../TestCases/Utilities/getCondimentGroup.ts';
import * as getModifiers from '../../TestCases/Utilities/getModifiers.ts'; // Import the function to get the modifiers
import { clickMatchingCell } from '../../TestCases/Utilities/getDeployment.ts'; // Import the function to click on the matching cell in the deployment page
import * as getDeployment from '../../TestCases/Utilities/storeDeployments.ts';



test.setTimeout(120000); // Set timeout to 2 minutes for the entire test suite

test('Single Item - General Info', async ({page}, testInfo) => {
  const logged = new LoggedPage(page, testInfo.title, testInfo.project.name);
  const loggedPage = logged.page;

  await loggedPage.goto(stgStudioUrl);

  // Login to STUDIO
  const loginPage = new LoginPage(loggedPage);
  await loginPage.login(stgLoginCredentials.email, stgLoginCredentials.password);

  // Select store
  const storeSelector = new StoreSelector(loggedPage);
  const storeName = await storeSelector.selectStore();

  // Check if there's in progress deployment
  const deploymentChecker = new DeploymentChecker(loggedPage);
  await deploymentChecker.openAndFilterDeployments();
  await deploymentChecker.assertNoInProgressDeployment(storeName);
  await deploymentChecker.returnToStudio();

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
  await loggedPage.getByRole('textbox').fill(logged.deploymentName);
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


test('Single Item - Price: Platform Pricing', async ({page}, testInfo) => {
  const logged = new LoggedPage(page, testInfo.title, testInfo.project.name);
  const loggedPage = logged.page;

  await loggedPage.goto(stgStudioUrl);

    // Login to STUDIO
  await loggedPage.getByRole('textbox', { name: 'Email' }).click();
  await loggedPage.getByRole('textbox', { name: 'Email' }).fill(stgLoginCredentials.email);
  await loggedPage.getByRole('textbox', { name: 'Password' }).click();
  await loggedPage.getByRole('textbox', { name: 'Password' }).fill(stgLoginCredentials.password);
  await loggedPage.getByRole('button', { name: 'Sign in' }).click();
  await loggedPage.waitForTimeout(10000);

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
  await loggedPage.waitForTimeout(10000);

  // Item
  await loggedPage.getByRole('textbox', {name: 'Search PLU / Item Name here'}).click();
  await loggedPage.getByRole('textbox', {name: 'Search PLU / Item Name here'}).fill(PLU);
  await loggedPage.locator('xpath=//div[@id="row-0"]').nth(0).click();
  await loggedPage.getByRole('tab', { name: 'Pricing' }).click();
  const fieldValue = await loggedPage.locator('input[name="SellDPOSShop"]').inputValue(); // will be used to get the value of the field SellDPOSShop
  const convertedFieldValue = parseFloat(fieldValue.replace(/[^0-9.-]+/g,"")); // will be used to convert the field value to a number
  if (convertedFieldValue < 11) {
    const newPrice = Number(convertedFieldValue) + addPrice;
    await loggedPage.locator('input[name="SellDPOSShop"]').fill(newPrice.toFixed());
  } else {
    if (getOperation === '+') {
        const newPrice = convertedFieldValue + addPrice;
        await loggedPage.locator('input[name="SellDPOSShop"]').fill(newPrice.toFixed());
    } else {
        const newPrice = convertedFieldValue - addPrice;
        await loggedPage.locator('input[name="SellDPOSShop"]').fill(newPrice.toFixed());
    }
  };
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
  await loggedPage.getByRole('textbox').fill(logged.deploymentName);
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


test('Single Item - Price: Apply All', async ({page}, testInfo) => {
  const logged = new LoggedPage(page, testInfo.title, testInfo.project.name);
  const loggedPage = logged.page;

  await loggedPage.goto(stgStudioUrl);

      // Login to STUDIO
  await loggedPage.getByRole('textbox', { name: 'Email' }).click();
  await loggedPage.getByRole('textbox', { name: 'Email' }).fill('vin.cuenza@easypos.com.ph');
  await loggedPage.getByRole('textbox', { name: 'Password' }).click();
  await loggedPage.getByRole('textbox', { name: 'Password' }).fill('Aa1234567890!');
  await loggedPage.getByRole('button', { name: 'Sign in' }).click();
  await loggedPage.waitForTimeout(10000);

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
  await loggedPage.waitForTimeout(10000);

  // Item
  await loggedPage.getByRole('textbox', {name: 'Search PLU / Item Name here'}).click();
  await loggedPage.getByRole('textbox', {name: 'Search PLU / Item Name here'}).fill(PLU);
  await loggedPage.locator('xpath=//div[@id="row-0"]').nth(0).click();
  await loggedPage.getByRole('tab', { name: 'Pricing' }).click();
  await screenshotFunc(loggedPage, testInfo);
  await loggedPage.locator('input[name="applyAll"]').check();
  const fieldValue = await loggedPage.locator('input[name="SellPrice"]').inputValue(); // will be used to get the value of the field SellDPOSShop
  const convertedFieldValue = parseFloat(fieldValue.replace(/[^0-9.-]+/g,"")); // will be used to convert the field value to a number
  if (convertedFieldValue < 11) {
    const newPrice = Number(convertedFieldValue) + addPrice;
    await loggedPage.locator('input[name="SellPrice"]').fill(newPrice.toFixed());
  } else {
    if (getOperation === '+') {
        const newPrice = convertedFieldValue + addPrice;
        await loggedPage.locator('input[name="SellPrice"]').fill(newPrice.toFixed());
    } else {
        const newPrice = convertedFieldValue - addPrice;
        await loggedPage.locator('input[name="SellPrice"]').fill(newPrice.toFixed());
    }
  };

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
  await loggedPage.getByRole('textbox').fill(logged.deploymentName);
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


test('Single Item - Current Toppings & Condiment Group', async ({page}, testInfo) => {
  const logged = new LoggedPage(page, testInfo.title, testInfo.project.name);
  const loggedPage = logged.page;

  await loggedPage.goto(stgStudioUrl);

  // Login to STUDIO
  await loggedPage.getByRole('textbox', { name: 'Email' }).click();
  await loggedPage.getByRole('textbox', { name: 'Email' }).fill(stgLoginCredentials.email);
  await loggedPage.getByRole('textbox', { name: 'Password' }).click();
  await loggedPage.getByRole('textbox', { name: 'Password' }).fill(stgLoginCredentials.password);
  await loggedPage.getByRole('button', { name: 'Sign in' }).click();
  await loggedPage.waitForTimeout(10000);

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
  await loggedPage.waitForTimeout(10000);

  // Selecting Item
  await loggedPage.getByRole('textbox', {name: 'Search PLU / Item Name here'}).click();
  await loggedPage.getByRole('textbox', {name: 'Search PLU / Item Name here'}).fill(PLU);
  await loggedPage.locator('xpath=//div[@id="row-0"]').nth(0).click();

  // Ingredients
  await loggedPage.locator('#tabs-edit-menu-item-tab-extras').click();
  await screenshotFunc(loggedPage, testInfo);
  await getCondimentGroup.removeTopping(loggedPage, 0);   // Remove 3 Current Toppings
  await loggedPage.getByRole('combobox').click();
  await getCondimentGroup.selectLargestOption(loggedPage); // Select the largest option from the condiment group dropdown
  await getCondimentGroup.clickExtrasSequentially(loggedPage); // Select 5 extras
  await screenshotFunc(loggedPage, testInfo);

  // Save changes
  await loggedPage.getByRole('button', { name: 'Save' }).click();
  await loggedPage.waitForTimeout(10000);

  // Deploy
  await loggedPage.locator('xpath=//button[@id="deploy-button"]').click();
  await loggedPage.getByRole('button', { name: 'Next' }).click();
  await loggedPage.getByRole('button', { name: 'Next' }).click();
  await loggedPage.getByRole('button', { name: 'Deploy (1)' }).click();
  await loggedPage.getByRole('button').filter({ hasText: /^$/}).click();
  await loggedPage.getByRole('textbox').press('ControlOrMeta+a');
  await loggedPage.getByRole('textbox').fill(logged.deploymentName);
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


test('Single Item - Modifiers', async ({page}, testInfo) => {
  const logged = new LoggedPage(page, testInfo.title, testInfo.project.name);
  const loggedPage = logged.page;

  await loggedPage.goto(stgStudioUrl);  

  // Login to STUDIO
  await loggedPage.getByRole('textbox', { name: 'Email' }).click();
  await loggedPage.getByRole('textbox', { name: 'Email' }).fill(stgLoginCredentials.email);
  await loggedPage.getByRole('textbox', { name: 'Password' }).click();
  await loggedPage.getByRole('textbox', { name: 'Password' }).fill(stgLoginCredentials.password);
  await loggedPage.getByRole('button', { name: 'Sign in' }).click();
  await loggedPage.waitForTimeout(10000);

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
  await loggedPage.waitForTimeout(10000);

  // Selecting Item
  await loggedPage.getByRole('textbox', {name: 'Search PLU / Item Name here'}).click();
  await loggedPage.getByRole('textbox', {name: 'Search PLU / Item Name here'}).fill(PLU);
  await loggedPage.locator('xpath=//div[@id="row-0"]').nth(0).click();
  await loggedPage.locator('#tabs-edit-menu-item-tab-item_options').click();
  await loggedPage.waitForTimeout(3000);

  // Modofiers
  await screenshotFunc(loggedPage, testInfo);
  await getModifiers.addModifiers(loggedPage); // Add modifiers
  await screenshotFunc(loggedPage, testInfo);
  await getModifiers.removeModifiers(loggedPage); // Remove modifiers
  await screenshotFunc(loggedPage, testInfo);

  // Save changes
  await loggedPage.getByRole('button', { name: 'Save' }).click();
  await loggedPage.waitForTimeout(10000);

  // Deploy
  await loggedPage.locator('xpath=//button[@id="deploy-button"]').click();
  await loggedPage.getByRole('button', { name: 'Next' }).click();
  await loggedPage.getByRole('button', { name: 'Next' }).click();
  await loggedPage.getByRole('button', { name: 'Deploy (1)' }).click();
  await loggedPage.getByRole('button').filter({ hasText: /^$/}).click();
  await loggedPage.getByRole('textbox').press('ControlOrMeta+a');
  await loggedPage.getByRole('textbox').fill(logged.deploymentName);
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

test('Single Item - Advance', async ({page}, testInfo) => {
  const logged = new LoggedPage(page, testInfo.title, testInfo.project.name);
  const loggedPage = logged.page;

  await loggedPage.goto(stgStudioUrl);

  // Login to STUDIO
  await loggedPage.getByRole('textbox', { name: 'Email' }).click();
  await loggedPage.getByRole('textbox', { name: 'Email' }).fill(stgLoginCredentials.email);
  await loggedPage.getByRole('textbox', { name: 'Password' }).click();
  await loggedPage.getByRole('textbox', { name: 'Password' }).fill(stgLoginCredentials.password);
  await loggedPage.getByRole('button', { name: 'Sign in' }).click();
  await loggedPage.waitForTimeout(10000);

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
  await loggedPage.waitForTimeout(10000);

  // Selecting Item
  await loggedPage.getByRole('textbox', {name: 'Search PLU / Item Name here'}).click();
  await loggedPage.getByRole('textbox', {name: 'Search PLU / Item Name here'}).fill(PLU);
  await loggedPage.locator('xpath=//div[@id="row-0"]').nth(0).click();

  // Advance
  await loggedPage.getByRole('tab', { name: 'Advanced' }).click();
  await loggedPage.locator('input[name="visual_tag"]').click();
    for (const char of addRandomLetters) {
    await loggedPage.keyboard.press(char);
  }

  // Save changes
  await loggedPage.getByRole('button', { name: 'Save' }).click();
  await loggedPage.waitForTimeout(10000);

  // Deploy
  await loggedPage.locator('xpath=//button[@id="deploy-button"]').click();
  await loggedPage.getByRole('button', { name: 'Next' }).click();
  await loggedPage.getByRole('button', { name: 'Next' }).click();
  await loggedPage.getByRole('button', { name: 'Deploy (1)' }).click();
  await loggedPage.getByRole('button').filter({ hasText: /^$/}).click();
  await loggedPage.getByRole('textbox').press('ControlOrMeta+a');
  await loggedPage.getByRole('textbox').fill(logged.deploymentName);
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


test('Single Item - ALL', async ({page}, testInfo) => {
  const logged = new LoggedPage(page, testInfo.title, testInfo.project.name);
  const loggedPage = logged.page;

  await loggedPage.goto(stgStudioUrl);

  // Login to STUDIO
  await loggedPage.getByRole('textbox', { name: 'Email' }).click();
  await loggedPage.getByRole('textbox', { name: 'Email' }).fill(stgLoginCredentials.email);
  await loggedPage.getByRole('textbox', { name: 'Password' }).click();
  await loggedPage.getByRole('textbox', { name: 'Password' }).fill(stgLoginCredentials.password);
  await loggedPage.getByRole('button', { name: 'Sign in' }).click();
  await loggedPage.waitForTimeout(10000);

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
  await loggedPage.waitForTimeout(10000);

  // Selecting Item
  await loggedPage.getByRole('textbox', {name: 'Search PLU / Item Name here'}).click();
  await loggedPage.getByRole('textbox', {name: 'Search PLU / Item Name here'}).fill(PLU);
  await loggedPage.locator('xpath=//div[@id="row-0"]').nth(0).click();
  
  // Item
  await loggedPage.waitForTimeout(500);
  await screenshotFunc(loggedPage, testInfo);
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

  // Pricing
  await loggedPage.getByRole('tab', { name: 'Pricing' }).click();
  await screenshotFunc(loggedPage, testInfo);
  await loggedPage.locator('input[name="applyAll"]').check();
  const fieldValue = await loggedPage.locator('input[name="SellPrice"]').inputValue(); // will be used to get the value of the field SellDPOSShop
  const convertedFieldValue = parseFloat(fieldValue.replace(/[^0-9.-]+/g,"")); // will be used to convert the field value to a number
  if (convertedFieldValue < 11) {
    const newPrice = Number(convertedFieldValue) + addPrice;
    await loggedPage.locator('input[name="SellPrice"]').fill(newPrice.toFixed());
  } else {
    if (getOperation === '+') {
        const newPrice = convertedFieldValue + addPrice;
        await loggedPage.locator('input[name="SellPrice"]').fill(newPrice.toFixed());
    } else {
        const newPrice = convertedFieldValue - addPrice;
        await loggedPage.locator('input[name="SellPrice"]').fill(newPrice.toFixed());
    }
  };
  await screenshotFunc(loggedPage, testInfo);

  // Ingredients
  await loggedPage.locator('#tabs-edit-menu-item-tab-extras').click();
  await screenshotFunc(loggedPage, testInfo);
  await getCondimentGroup.removeTopping(loggedPage, 0);   // Remove 3 Current Toppings
  await loggedPage.getByRole('combobox').click();
  await getCondimentGroup.selectLargestOption(loggedPage); // Select the largest option from the condiment group dropdown
  await getCondimentGroup.clickExtrasSequentially(loggedPage); // Select 5 extras
  await screenshotFunc(loggedPage, testInfo);

  // Modofiers
  await loggedPage.locator('#tabs-edit-menu-item-tab-item_options').click();
  await loggedPage.waitForTimeout(3000);
  await screenshotFunc(loggedPage, testInfo);
  await getModifiers.addModifiers(loggedPage); // Add modifiers
  await screenshotFunc(loggedPage, testInfo);
  await getModifiers.removeModifiers(loggedPage); // Remove modifiers
  await screenshotFunc(loggedPage, testInfo);

  // Save changes
  await loggedPage.getByRole('button', { name: 'Save' }).click();
  await loggedPage.waitForTimeout(10000);

  // Deploy
  await loggedPage.locator('xpath=//button[@id="deploy-button"]').click();
  await loggedPage.getByRole('button', { name: 'Next' }).click();
  await loggedPage.getByRole('button', { name: 'Next' }).click();
  await loggedPage.getByRole('button', { name: 'Deploy (1)' }).click();
  await loggedPage.getByRole('button').filter({ hasText: /^$/}).click();
  await loggedPage.getByRole('textbox').press('ControlOrMeta+a');
  await loggedPage.getByRole('textbox').fill(logged.deploymentName);
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
