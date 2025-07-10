import {test} from '@playwright/test'
import {screenshotFunc} from '../../Utilities/screenshot'; // Import the screenshot function  sample edit
import {addRandomLetters} from  '../../Utilities/getAddDeleteChar'; // Import the function to get a random character to add or delete 
import {PLU} from '../../Utilities/getPLU.ts'; // Import the function to get a random PLU
import {getOperation, addPrice} from '../../Utilities/getOperation'; // Import the function to get a random operation to perform on the price of the items.
import {createLogger, createLoggedPage} from '../../Utilities/logger'; // Import the logger utilities
import {getStoreResolution} from '../../Utilities/getResolution'; // Import the function to get the viewport size
import {stgStudioUrl, stgLoginCredentials, stgDeploymentsUrl} from '../../Utilities/getCredentialsAndUrl'; // Import the URLs and login credentials for staging environment
import * as getCondimentGroup from '../../Utilities/getCondimentGroup';
import * as getModifiers from '../../Utilities/getModifiers'; // Import the function to get the modifiers
import { clickMatchingCell } from '../../Utilities/getDeployment'; // Import the function to click on the matching cell in the deployment page

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


test('Single Item - Price: Platform Pricing', async ({page}, testInfo) => {
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
  await loggedPage.getByRole('searchbox', { name: 'Search' }).fill('VS Test Store 01');
  await loggedPage.getByRole('button', { name: 'Vs test store' }).click();
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


test('Single Item - Price: Apply All', async ({page}, testInfo) => {
  const { logToFile, deploymentName } = createLogger(testInfo.title, testInfo.project.name);
  const loggedPage = createLoggedPage(page, logToFile);
  await loggedPage.goto('https://stg.my.deliverit.com.au/');  

      // Login to STUDIO
  await loggedPage.getByRole('textbox', { name: 'Email' }).click();
  await loggedPage.getByRole('textbox', { name: 'Email' }).fill('vin.cuenza@easypos.com.ph');
  await loggedPage.getByRole('textbox', { name: 'Password' }).click();
  await loggedPage.getByRole('textbox', { name: 'Password' }).fill('Aa1234567890!');
  await loggedPage.getByRole('button', { name: 'Sign in' }).click();
  await loggedPage.waitForTimeout(10000);

  // Select store
  await loggedPage.locator('#btn-store-selector').nth(0).click();
  await loggedPage.getByRole('searchbox', { name: 'Search' }).click();
  await loggedPage.getByRole('searchbox', { name: 'Search' }).fill('VS Test Store 01');
  await loggedPage.getByRole('button', { name: 'Vs test store' }).click();
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


test('Single Item - Current Toppings & Condiment Group', async ({page}, testInfo) => {
  const { logToFile, deploymentName } = createLogger(testInfo.title, testInfo.project.name);
  const loggedPage = createLoggedPage(page, logToFile);
  await loggedPage.goto('https://stg.my.deliverit.com.au/');  

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


test('Single Item - Modifiers', async ({page}, testInfo) => {
  const { logToFile, deploymentName } = createLogger(testInfo.title, testInfo.project.name);
  const loggedPage = createLoggedPage(page, logToFile);
  await loggedPage.goto('https://stg.my.deliverit.com.au/');   

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

test('Single Item - Advance', async ({page}, testInfo) => {
  const { logToFile, deploymentName } = createLogger(testInfo.title, testInfo.project.name);
  const loggedPage = createLoggedPage(page, logToFile);
  await loggedPage.goto('https://stg.my.deliverit.com.au/');  

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


test('Single Item - ALL', async ({page}, testInfo) => {
  const { logToFile, deploymentName } = createLogger(testInfo.title, testInfo.project.name);
  const loggedPage = createLoggedPage(page, logToFile);
  await loggedPage.goto('https://stg.my.deliverit.com.au/');

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
