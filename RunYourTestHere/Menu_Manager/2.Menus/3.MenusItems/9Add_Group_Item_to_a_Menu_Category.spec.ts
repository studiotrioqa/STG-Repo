import { test } from '../../../../Utilities/base.fixture';
// import { Page, test } from '@playwright/test'

// Pages
import { DeploymentPage } from '../../../../Pages/Menu_Manager/1.Items/deploymentPage';
import { MenuSaveButton } from '../../../../Pages/Menu_Manager/1.Items/itemSaveButton';
import { GoToMenus } from '../../../../Pages/Menu_Manager/2.Menus/goToMenus';
import { AddGroupItemToMenuCategory } from '../../../../Pages/Menu_Manager/2.Menus/addItemToAMenuCategory';

// Utilities
import { getStoreNameByResolution, selectStore } from '../../../../Utilities/storeSelector';
import { addRandomLetters } from  '../../../../Utilities/getAddDeleteChar';
import { PLU, GroupPLU } from '../../../../Utilities/getPLU'; 
import { getOperation, addPrice } from '../../../../Utilities/getOperation'; 
import { makeDeploymentName } from '../../../../Utilities/testUtils';
import { stgStudioUrl, stgLoginCredentials, stgDeploymentsUrl } from '../../../../Utilities/getCredentialsAndUrl';

test.setTimeout(600000); // Set timeout to 10 minutes for the entire test suite

test('Add_Group_Item_to_a_Menu_Category', async ({page}, testInfo) => {
  const deploymentName = makeDeploymentName(testInfo.title, testInfo.project.name);
  await page.goto(stgStudioUrl, {
    waitUntil: 'domcontentloaded',
  });

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

  // Add Group Item to a Menu Category
  const addGroupItemToMenuCategory = new AddGroupItemToMenuCategory(page);
  await addGroupItemToMenuCategory.addGroupItemtoMenuCategory(GroupPLU);

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