import { test } from '../../../../Utilities/base.fixture';

// Pages
import { LoginPage } from '../../../../Pages/Menu_Manager/1.Items/login';
import { SearchPLU } from '../../../../Pages/Menu_Manager/1.Items/itemSearchItem';
import { ItemGeneral } from '../../../../Pages/Menu_Manager/1.Items/itemGeneral';
import { ItemPlatformPricing, ItemApplyAllPricing } from '../../../../Pages/Menu_Manager/1.Items/itemPricing';
import { ItemIngredients } from '../../../../Pages/Menu_Manager/1.Items/itemIngredients';
import { ItemModifiers } from '../../../../Pages/Menu_Manager/1.Items/itemModifiers';
import { ItemAdvancedEditor } from '../../../../Pages/Menu_Manager/1.Items/itemAdvanced';
import { DeploymentPage } from '../../../../Pages/Menu_Manager/1.Items/deploymentPage';
import { ItemSaveButton } from '../../../../Pages/Menu_Manager/1.Items/itemSaveButton';
import { GoToMenus } from '../../../../Pages/Menu_Manager/2.Menus/goToMenus';
import { CreateNewItem } from '../../../../Pages/Menu_Manager/1.Items/createNewItem';

// Utilities
import { makeDeploymentName } from '../../../../Utilities/testUtils';
import { getStoreNameByResolution, selectStore } from '../../../../Utilities/storeSelector';
import { addRandomLetters } from  '../../../../Utilities/getAddDeleteChar';
import { PLU } from '../../../../Utilities/getPLU'; 
import { getOperation, addPrice } from '../../../../Utilities/getOperation'; 
import { stgStudioUrl, stgLoginCredentials, stgDeploymentsUrl } from '../../../../Utilities/getCredentialsAndUrl';


test.setTimeout(600000); // Set timeout to 10 minutes for the entire test suite

test('Create Item', async ({page}, testInfo) => {
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
  // await deploymentPage.openAndFilterDeployments();
  // await deploymentPage.assertNoInProgressDeployment(storeName);
  // await deploymentPage.returnToStudio();

  // Create new Item
  const createNewItem = new CreateNewItem(page, deploymentName);
  await createNewItem.clickCreateNewItemButton();
  await createNewItem.categorySelection(testInfo);
  await createNewItem.createItemBasedOnSubCategory(testInfo);
  await createNewItem.setItemPrice(testInfo);
  await createNewItem.setItemImage(testInfo);
  await createNewItem.ingredientsSubCategorySelector(testInfo);
  await createNewItem.createItemAddModifiers(undefined, testInfo);
  await createNewItem.createSelectMenuSet(testInfo);
  await createNewItem.checkItemInMenuset(testInfo);

  // Deploy
  await deploymentPage.deployItem();

  // Go to Deployments Page
  await deploymentPage.openDeploymentLog(stgDeploymentsUrl);
  await deploymentPage.openDeploymentDetailByName(deploymentName);
  const deploymentId = await deploymentPage.getDeploymentId();
});