import { Page, test } from '@playwright/test'

// Pages
import { LoginPage } from '../../../Pages/Menu Manager/1. Items/login';
import { SearchPLU } from '../../../Pages/Menu Manager/1. Items/itemSearchItem';
import { ItemGeneral } from '../../../Pages/Menu Manager/1. Items/itemGeneral';
import { ItemPlatformPricing, ItemApplyAllPricing } from '../../../Pages/Menu Manager/1. Items/itemPricing';
import { ItemIngredients } from '../../../Pages/Menu Manager/1. Items/itemIngredients';
import { ItemModifiers } from '../../../Pages/Menu Manager/1. Items/itemModifiers';
import { ItemAdvancedEditor } from '../../../Pages/Menu Manager/1. Items/itemAdvanced';
import { DeploymentPage } from '../../../Pages/Menu Manager/1. Items/deploymentPage';
import { ItemSaveButton } from '../../../Pages/Menu Manager/1. Items/itemSaveButton';

// Utilities
import { screenshotFunc } from '../../../Utilities/screenshot';
import { getStoreNameByResolution, selectStore } from '../../../Utilities/storeSelector';
import { addRandomLetters } from  '../../../Utilities/getAddDeleteChar';
import { PLU } from '../../../Utilities/getPLU'; 
import { getOperation, addPrice } from '../../../Utilities/getOperation'; 
import { LoggedPage } from '../../../Utilities/logger';
import { stgStudioUrl, stgLoginCredentials, stgDeploymentsUrl } from '../../../Utilities/getCredentialsAndUrl';


test.setTimeout(600000); // Set timeout to 10 minutes for the entire test suite

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