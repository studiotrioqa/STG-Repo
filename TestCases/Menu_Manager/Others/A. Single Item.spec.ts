import { Page, test } from '@playwright/test'

// Pages
import { LoginPage } from '../../Pages/Menu_Manager/1.Items/login';
import { SearchPLU } from '../../Pages/Menu_Manager/1.Items/itemSearchItem';
import { ItemGeneral } from '../../Pages/Menu_Manager/1.Items/itemGeneral';
import { ItemPlatformPricing, ItemApplyAllPricing } from '../../Pages/Menu_Manager/1.Items/itemPricing';
import { ItemIngredients } from '../../Pages/Menu_Manager/1.Items/itemIngredients';
import { ItemModifiers } from '../../Pages/Menu_Manager/1.Items/itemModifiers';
import { ItemAdvancedEditor } from '../../Pages/Menu_Manager/1.Items/itemAdvanced';
import { DeploymentPage } from '../../Pages/Menu_Manager/1.Items/deploymentPage';
import { ItemSaveButton } from '../../Pages/Menu_Manager/1.Items/itemSaveButton';

// Utilities
import { screenshotFunc } from '../../Utilities/screenshot';
import { getStoreNameByResolution, selectStore } from '../../Utilities/storeSelector';
import { addRandomLetters } from  '../../Utilities/getAddDeleteChar';
import { PLU } from '../../Utilities/getPLU'; 
import { getOperation, addPrice } from '../../Utilities/getOperation'; 
import { LoggedPage } from '../../Utilities/logger';
import { stgStudioUrl, stgLoginCredentials, stgDeploymentsUrl } from '../../Utilities/getCredentialsAndUrl';


test.setTimeout(600000); // Set timeout to 10 minutes for the entire test suite

test('Single Item - General Info', async ({page}, testInfo) => {
  const logged = new LoggedPage(page, testInfo.title, testInfo.project.name);
  const loggedPage = logged.page;

  await loggedPage.goto(stgStudioUrl);

  // Login to STUDIO
  const loginPage = new LoginPage(loggedPage);
  await loginPage.login(stgLoginCredentials.email, stgLoginCredentials.password);

  // Select store
  await selectStore(loggedPage);
  const storeName = await getStoreNameByResolution(loggedPage);

  // Check if there's in progress deployment
  const deploymentPage = new DeploymentPage(loggedPage, logged.deploymentName);
  await deploymentPage.openAndFilterDeployments();
  await deploymentPage.assertNoInProgressDeployment(storeName);
  await deploymentPage.returnToStudio();

  // Search for Item
  const itemSearch = new SearchPLU(loggedPage);
  await itemSearch.searchPLU(PLU);

  // Selecting Item
  const itemEditor = new ItemGeneral(loggedPage);
  await itemEditor.editFieldsWithRandomLetters(addRandomLetters);

  // Screenshot before saving
  await screenshotFunc(loggedPage, testInfo);
 
  // Save changes
  const itemSaveButton = new ItemSaveButton(loggedPage);
  await itemSaveButton.save();

  // Deploy
  await deploymentPage.deployItem();

  // Go to Deployments Page
  await deploymentPage.openDeploymentLog(stgDeploymentsUrl);
  await deploymentPage.openDeploymentDetailByName(logged.deploymentName);
  const deploymentId = await deploymentPage.getDeploymentId();
});


test('Single Item - Price: Platform Pricing', async ({page}, testInfo) => {
  const logged = new LoggedPage(page, testInfo.title, testInfo.project.name);
  const loggedPage = logged.page;

  await loggedPage.goto(stgStudioUrl);

  // Login to STUDIO
  const loginPage = new LoginPage(loggedPage);
  await loginPage.login(stgLoginCredentials.email, stgLoginCredentials.password);

  // Select store
  await selectStore(loggedPage);
  const storeName = await getStoreNameByResolution(loggedPage);

  // Check if there's in progress deployment
  const deploymentPage = new DeploymentPage(loggedPage, logged.deploymentName);
  await deploymentPage.openAndFilterDeployments();
  await deploymentPage.assertNoInProgressDeployment(storeName);
  await deploymentPage.returnToStudio();

  // Search for Item
  const itemSearch = new SearchPLU(loggedPage);
  await itemSearch.searchPLU(PLU);

  // Selecting Item, open Pricing tab and edit price
  const itemPlatformPricing = new ItemPlatformPricing(loggedPage);
  await itemPlatformPricing.goToPricingAndEditPlatformPricing(addPrice, getOperation as ('+' | '-'), screenshotFunc, testInfo);

  // Screenshot before saving
  await screenshotFunc(loggedPage, testInfo);
 
  // Save changes
  const itemSaveButton = new ItemSaveButton(loggedPage);
  await itemSaveButton.save();

  // Deploy
  await deploymentPage.deployItem();

  // Go to Deployments Page
  await deploymentPage.openDeploymentLog(stgDeploymentsUrl);
  await deploymentPage.openDeploymentDetailByName(logged.deploymentName);
  const deploymentId = await deploymentPage.getDeploymentId();
});


test('Single Item - Price: Apply All', async ({page}, testInfo) => {
  const logged = new LoggedPage(page, testInfo.title, testInfo.project.name);
  const loggedPage = logged.page;

  await loggedPage.goto(stgStudioUrl);

  // Login to STUDIO
  const loginPage = new LoginPage(loggedPage);
  await loginPage.login(stgLoginCredentials.email, stgLoginCredentials.password);

  // Select store
  await selectStore(loggedPage);
  const storeName = await getStoreNameByResolution(loggedPage);

  // Check if there's in progress deployment
  const deploymentPage = new DeploymentPage(loggedPage, logged.deploymentName);
  await deploymentPage.openAndFilterDeployments();
  await deploymentPage.assertNoInProgressDeployment(storeName);
  await deploymentPage.returnToStudio();

  // Search for Item
  const itemSearch = new SearchPLU(loggedPage);
  await itemSearch.searchPLU(PLU);

  // Selecting Item, open Pricing tab and edit price
  const itemApplyAllPricing = new ItemApplyAllPricing(loggedPage);
  await itemApplyAllPricing.goToPricingAndEditApplyAll(addPrice, getOperation as ('+' | '-'), screenshotFunc, testInfo);

  // Screenshot before saving
  await screenshotFunc(loggedPage, testInfo);
 
  // Save changes
  const itemSaveButton = new ItemSaveButton(loggedPage);
  await itemSaveButton.save();

  // Deploy
  await deploymentPage.deployItem();

  // Go to Deployments Page
  await deploymentPage.openDeploymentLog(stgDeploymentsUrl);
  await deploymentPage.openDeploymentDetailByName(logged.deploymentName);
  const deploymentId = await deploymentPage.getDeploymentId();
});


test('Single Item - Current Toppings & Condiment Group', async ({page}, testInfo) => {
  const logged = new LoggedPage(page, testInfo.title, testInfo.project.name);
  const loggedPage = logged.page;

  await loggedPage.goto(stgStudioUrl);

  // Login to STUDIO
  const loginPage = new LoginPage(loggedPage);
  await loginPage.login(stgLoginCredentials.email, stgLoginCredentials.password);

  // Select store
  await selectStore(loggedPage);
  const storeName = await getStoreNameByResolution(loggedPage);

  // Check if there's in progress deployment
  const deploymentPage = new DeploymentPage(loggedPage, logged.deploymentName);
  await deploymentPage.openAndFilterDeployments();
  await deploymentPage.assertNoInProgressDeployment(storeName);
  await deploymentPage.returnToStudio();

  // Search for Item
  const itemSearch = new SearchPLU(loggedPage);
  await itemSearch.searchPLU(PLU);

  // Ingredients
  const itemIngredients = new ItemIngredients(loggedPage);
  await itemIngredients.editExtras(screenshotFunc, testInfo);

  // Screenshot before saving
  await screenshotFunc(loggedPage, testInfo);
 
  // Save changes
  const itemSaveButton = new ItemSaveButton(loggedPage);
  await itemSaveButton.save();

  // Deploy
  await deploymentPage.deployItem();

  // Go to Deployments Page
  await deploymentPage.openDeploymentLog(stgDeploymentsUrl);
  await deploymentPage.openDeploymentDetailByName(logged.deploymentName);
  const deploymentId = await deploymentPage.getDeploymentId();
});


test('Single Item - Modifiers', async ({page}, testInfo) => {
  const logged = new LoggedPage(page, testInfo.title, testInfo.project.name);
  const loggedPage = logged.page;

  await loggedPage.goto(stgStudioUrl);

  // Login to STUDIO
  const loginPage = new LoginPage(loggedPage);
  await loginPage.login(stgLoginCredentials.email, stgLoginCredentials.password);

  // Select store
  await selectStore(loggedPage);
  const storeName = await getStoreNameByResolution(loggedPage);

  // Check if there's in progress deployment
  const deploymentPage = new DeploymentPage(loggedPage, logged.deploymentName);
  await deploymentPage.openAndFilterDeployments();
  await deploymentPage.assertNoInProgressDeployment(storeName);
  await deploymentPage.returnToStudio();

  // Search for Item
  const itemSearch = new SearchPLU(loggedPage);
  await itemSearch.searchPLU(PLU);

  // Selecting Item and open Modifiers tab
  const modifiers = new ItemModifiers(loggedPage);

  // Click on Modifiers tab
  await modifiers.clickModifierTab(); 

  // Add modifiers
  await screenshotFunc(loggedPage, testInfo);
  await modifiers.addModifiers();
  await screenshotFunc(loggedPage, testInfo);

  // Remove modifiers
  await modifiers.removeModifiers();

  // Screenshot before saving
  await screenshotFunc(loggedPage, testInfo);
 
  // Save changes
  const itemSaveButton = new ItemSaveButton(loggedPage);
  await itemSaveButton.save();

  // Deploy
  await deploymentPage.deployItem();

  // Go to Deployments Page
  await deploymentPage.openDeploymentLog(stgDeploymentsUrl);
  await deploymentPage.openDeploymentDetailByName(logged.deploymentName);
  const deploymentId = await deploymentPage.getDeploymentId();
});


test('Single Item - Advance', async ({page}, testInfo) => {
  const logged = new LoggedPage(page, testInfo.title, testInfo.project.name);
  const loggedPage = logged.page;

  await loggedPage.goto(stgStudioUrl);

  // Login to STUDIO
  const loginPage = new LoginPage(loggedPage);
  await loginPage.login(stgLoginCredentials.email, stgLoginCredentials.password);

  // Select store
  await selectStore(loggedPage);
  const storeName = await getStoreNameByResolution(loggedPage);

  // Check if there's in progress deployment
  const deploymentPage = new DeploymentPage(loggedPage, logged.deploymentName);
  await deploymentPage.openAndFilterDeployments();
  await deploymentPage.assertNoInProgressDeployment(storeName);
  await deploymentPage.returnToStudio();

  // Search for Item
  const itemSearch = new SearchPLU(loggedPage);
  await itemSearch.searchPLU(PLU);

  // Selecting Item, open Advanced tab and edit visual tag
  const advancedEditor = new ItemAdvancedEditor(loggedPage);
  await advancedEditor.addVisualTag(addRandomLetters);

  // Screenshot before saving
  await screenshotFunc(loggedPage, testInfo);
 
  // Save changes
  const itemSaveButton = new ItemSaveButton(loggedPage);
  await itemSaveButton.save();

  // Deploy
  await deploymentPage.deployItem();

  // Go to Deployments Page
  await deploymentPage.openDeploymentLog(stgDeploymentsUrl);
  await deploymentPage.openDeploymentDetailByName(logged.deploymentName);
  const deploymentId = await deploymentPage.getDeploymentId();
});


test('Single Item - ALL', async ({page}, testInfo) => {
  const logged = new LoggedPage(page, testInfo.title, testInfo.project.name);
  const loggedPage = logged.page;

  await loggedPage.goto(stgStudioUrl);

  // Login to STUDIO
  const loginPage = new LoginPage(loggedPage);
  await loginPage.login(stgLoginCredentials.email, stgLoginCredentials.password);

  // Select store
  await selectStore(loggedPage);
  const storeName = await getStoreNameByResolution(loggedPage);

  // Check if there's in progress deployment
  const deploymentPage = new DeploymentPage(loggedPage, logged.deploymentName);
  await deploymentPage.openAndFilterDeployments();
  await deploymentPage.assertNoInProgressDeployment(storeName);
  await deploymentPage.returnToStudio();

  // Search for Item
  const itemSearch = new SearchPLU(loggedPage);
  await itemSearch.searchPLU(PLU);

  // General Info
  const itemEditor = new ItemGeneral(loggedPage);
  await itemEditor.editFieldsWithRandomLetters(addRandomLetters);
  await screenshotFunc(loggedPage, testInfo);

  // Pricing (Apply All)
  const itemApplyAllPricing = new ItemApplyAllPricing(loggedPage);
  await itemApplyAllPricing.goToPricingAndEditApplyAll(addPrice, getOperation as ('+' | '-'), screenshotFunc, testInfo);
  await screenshotFunc(loggedPage, testInfo);

  // Ingredients
  const itemIngredients = new ItemIngredients(loggedPage);
  await itemIngredients.editExtras(screenshotFunc, testInfo);

  // Modifiers
  const modifiers = new ItemModifiers(loggedPage);
  await modifiers.clickModifierTab();
  await screenshotFunc(loggedPage, testInfo);
  await modifiers.addModifiers();
  await screenshotFunc(loggedPage, testInfo);
  await modifiers.removeModifiers();
  await screenshotFunc(loggedPage, testInfo);

  // Advanced
  const advancedEditor = new ItemAdvancedEditor(loggedPage);
  await advancedEditor.addVisualTag(addRandomLetters);
  await screenshotFunc(loggedPage, testInfo);

  // Save changes
  const itemSaveButton = new ItemSaveButton(loggedPage);
  await itemSaveButton.save();

  // Deploy
  await deploymentPage.deployItem();

  // Go to Deployments Page
  await deploymentPage.openDeploymentLog(stgDeploymentsUrl);
  await deploymentPage.openDeploymentDetailByName(logged.deploymentName);
  const deploymentId = await deploymentPage.getDeploymentId();
});
