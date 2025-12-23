import { test } from '../../../../Utilities/base.fixture';
// import { Page, test } from '@playwright/test'

// Pages
import { LoginPage } from '../../../../Pages/Menu_Manager/1.Items/login';
import { SearchPLU } from '../../../../Pages/Menu_Manager/1.Items/itemSearchItem';
import { ItemGeneral } from '../../../../Pages/Menu_Manager/1.Items/itemGeneral';
import { ItemApplyAllPricing } from '../../../../Pages/Menu_Manager/1.Items/itemPricing';
import { ItemIngredients } from '../../../../Pages/Menu_Manager/1.Items/itemIngredients';
import { ItemModifiers } from '../../../../Pages/Menu_Manager/1.Items/itemModifiers';
import { ItemAdvancedEditor } from '../../../../Pages/Menu_Manager/1.Items/itemAdvanced';
import { DeploymentPage } from '../../../../Pages/Menu_Manager/1.Items/deploymentPage';
import { ItemSaveButton, MenuSaveButton } from '../../../../Pages/Menu_Manager/1.Items/itemSaveButton';
import { GoToMenus } from '../../../../Pages/Menu_Manager/2.Menus/goToMenus';
import { CreateMenuset } from '../../../../Pages/Menu_Manager/2.Menus/createMenuset';
import { AddMenuCategory } from '../../../../Pages/Menu_Manager/2.Menus/createMenuCategory';
import { AddNormalItemToMenuCategory } from '../../../../Pages/Menu_Manager/2.Menus/addItemToAMenuCategory';
import { CheckItemType } from '../../../../Pages/Menu_Manager/2.Menus/checkItemType';


// Utilities
import { makeDeploymentName } from '../../../../Utilities/testUtils';
import { getStoreNameByResolution, selectStore } from '../../../../Utilities/storeSelector';
import { addRandomLetters } from  '../../../../Utilities/getAddDeleteChar';
import { PLU } from '../../../../Utilities/getPLU'; 
import { getOperation, addPrice } from '../../../../Utilities/getOperation'; 
import { stgStudioUrl, stgLoginCredentials, stgDeploymentsUrl } from '../../../../Utilities/getCredentialsAndUrl';

test.setTimeout(600000); // Set timeout to 10 minutes for the entire test suite

test('Edit Price - Apply All of a Normal Item in a Menu Category', async ({page}, testInfo) => {
  const deploymentName = makeDeploymentName(testInfo.title, testInfo.project.name);
  await page.goto(stgStudioUrl, {
    waitUntil: 'domcontentloaded',
  });

  // Login to STUDIO
  // Session is already authenticated via storageState
 
  // Select store
  await selectStore(page);
  const storeName = await getStoreNameByResolution(page);

  // Check if there's in progress deployment
  const deploymentPage = new DeploymentPage(page, deploymentName);
  await deploymentPage.openAndFilterDeployments();
  await deploymentPage.assertNoInProgressDeployment(storeName);
  await deploymentPage.returnToStudio();

  // Go to Menus
  const goToMenus = new GoToMenus(page);
  await goToMenus.clickMenus();

  // Check Item Type in a Menu Category
  const checkItemType = new CheckItemType(page);
  await checkItemType.checkItemType();

  // Open Pricing tab and edit price
  const itemApplyAllPricing = new ItemApplyAllPricing(page);
  await itemApplyAllPricing.goToPricingAndEditApplyAll(addPrice, getOperation as ('+' | '-'), testInfo);

  // Save changes
  const menuSaveButton = new MenuSaveButton(page);
  await menuSaveButton.menuSaveButton();

  // Deploy
  await deploymentPage.deployItem();

  // Go to Deployments Page
  await deploymentPage.openDeploymentLog(stgDeploymentsUrl);
  await deploymentPage.openDeploymentDetailByName(deploymentName);
  const deploymentId = await deploymentPage.getDeploymentId();
});