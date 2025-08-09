import { Page, test } from '@playwright/test'

// Pages
import { LoginPage } from '../../../../TestCases/Pages/Menu Manager/1. Items/login';
import { SearchPLU } from '../../../../TestCases/Pages/Menu Manager/1. Items/itemSearchItem';
import { ItemGeneral } from '../../../../TestCases/Pages/Menu Manager/1. Items/itemGeneral';
import { ItemPlatformPricing, ItemApplyAllPricing } from '../../../../TestCases/Pages/Menu Manager/1. Items/itemPricing';
import { ItemIngredients } from '../../../../TestCases/Pages/Menu Manager/1. Items/itemIngredients';
import { ItemModifiers } from '../../../../TestCases/Pages/Menu Manager/1. Items/itemModifiers';
import { ItemAdvancedEditor } from '../../../../TestCases/Pages/Menu Manager/1. Items/itemAdvanced';
import { DeploymentPage } from '../../../../TestCases/Pages/Menu Manager/1. Items/deploymentPage';
import { ItemSaveButton } from '../../../../TestCases/Pages/Menu Manager/1. Items/itemSaveButton';

// Utilities
import { screenshotFunc } from '../../../../TestCases/Utilities/screenshot';
import { getStoreNameByResolution, selectStore } from '../../../../TestCases/Utilities/storeSelector';
import { addRandomLetters } from  '../../../../TestCases/Utilities/getAddDeleteChar';
import { PLU } from '../../../../TestCases/Utilities/getPLU'; 
import { getOperation, addPrice } from '../../../../TestCases/Utilities/getOperation'; 
import { LoggedPage } from '../../../../TestCases/Utilities/logger';
import { stgStudioUrl, stgLoginCredentials, stgDeploymentsUrl } from '../../../../TestCases/Utilities/getCredentialsAndUrl';


test.setTimeout(600000); // Set timeout to 10 minutes for the entire test suite

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
