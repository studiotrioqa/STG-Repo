import { test } from '../../../../Utilities/base.fixture';
// import { Page, test } from '@playwright/test'

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
import { CreateMenuset } from '../../../../Pages/Menu_Manager/2.Menus/createMenuset';

// Utilities
import { screenshotFunc } from '../../../../Utilities/screenshot';
import { getStoreNameByResolution, selectStore } from '../../../../Utilities/storeSelector';
import { addRandomLetters } from  '../../../../Utilities/getAddDeleteChar';
import { PLU } from '../../../../Utilities/getPLU'; 
import { getOperation, addPrice } from '../../../../Utilities/getOperation'; 
import { LoggedPage } from '../../../../Utilities/logger';
import { stgStudioUrl, stgLoginCredentials, stgDeploymentsUrl } from '../../../../Utilities/getCredentialsAndUrl';


test.setTimeout(600000); // Set timeout to 10 minutes for the entire test suite

test('Menuset - Duplicate Menuset ', async ({page}, testInfo) => {
  const logged = new LoggedPage(page, testInfo.title, testInfo.project.name);
  const loggedPage = logged.page;

  await loggedPage.goto(stgStudioUrl);

  // Login to STUDIO
  const loginPage = new LoginPage(loggedPage);
  await loginPage.login(stgLoginCredentials.email, stgLoginCredentials.password);
 
  // Select store
  await selectStore(loggedPage);
  const storeName = await getStoreNameByResolution(loggedPage);

  // Go to Menus
  const goToMenus = new GoToMenus(loggedPage);
  await goToMenus.clickMenus();

  // Duplicate Menuset
  const duplicateMenuset = new DuplicateMenuset(logged);
  const dmName = await duplicateMenuset.duplicateMenuset(screenshotFunc, testInfo);
  
  // Check if Menuset exists
  const menuManager = new CreateMenuset(logged);
  await menuManager.checkifMenusetExists(dmName);
});