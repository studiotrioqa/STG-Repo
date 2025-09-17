
import { Page } from '@playwright/test';
import { LoggedPage } from '../../../Utilities/logger';


export class CreateNewItem {
  private newItemName: string = '';
  private getTotalCountOfSubCategory: number = 0;
  private menusetName: string = '';
  private menuCategoryName: string = '';

  constructor(private logged: LoggedPage) {}

  // Click on the '+' button to create a new item
  async clickCreateNewItemButton(): Promise<void> {
    await this.logged.page.getByText('+').click();
    await this.logged.page.locator('.select__control').click();
  }

  // Select random category from the dropdown
  async categorySelection(screenshotFunc: (loggedPage: Page, testInfo: any) => Promise<void>, testInfo: any): Promise<void> {
    const categorySelection = this.logged.page.locator('.select__menu > div > div');
    const getTotalCountOfCategory = await categorySelection.count();
    const randomCategoryIndex = Math.floor(Math.random() * getTotalCountOfCategory);
    const indexValue = await this.logged.page.locator('.select__menu > div > div').nth(randomCategoryIndex).locator('div div span').nth(0).textContent();
    await this.logged.page.locator('.select__menu > div > div').nth(randomCategoryIndex).locator('div div span').nth(0).click();
    // await this.logged.page.getByText('CONDIMENTS489').click();
    // await this.logged.page.locator('.select__input').fill( String(indexValue) );
    // await this.logged.page.locator('div#react-select-2-option-1 span').nth(0).click();
    this.newItemName = 'NIN' + String(this.logged.timestamp).replace(/[^a-zA-Z0-9]/g, '');
    await this.logged.page.locator('input[name="display_name"]').fill(this.newItemName);
    await this.logged.page.locator('textarea[name="description"]').fill('test description - ' + this.logged.timestamp);
    await this.logged.page.getByText('Disable from All Promotions').click();
    await screenshotFunc(this.logged.page, testInfo);
    await this.logged.page.getByRole('button', { name: 'Next', exact: true }).click();
  }

  // Create item(s) based on the number of sub-categories
 async createItemBasedOnSubCategory(screenshotFunc: (loggedPage: Page, testInfo: any) => Promise<void>,  testInfo: any): Promise<void> {

  const subCategoryContainer = this.logged.page.locator('.styles_main__oURzC');
  this.getTotalCountOfSubCategory = await subCategoryContainer.count();

  if (this.getTotalCountOfSubCategory === 1) {
    // Single subcategory
    await this.logged.page.waitForTimeout(3000);
    await this.logged.page.getByRole('textbox', { name: 'Enter name' }).click();
    await this.logged.page.getByRole('textbox', { name: 'Enter name' }).press('ControlOrMeta+a');
    await this.logged.page.getByRole('textbox', { name: 'Enter name' }).fill(this.newItemName + 'test0');
    await this.logged.page.getByPlaceholder('Enter PLU').nth(0).fill(this.newItemName + 'test0');
    await this.logged.page.getByRole('textbox', { name: 'Enter print name' }).click();
    await this.logged.page.getByRole('textbox', { name: 'Enter print name' }).press('ControlOrMeta+a');
    await this.logged.page.getByRole('textbox', { name: 'Enter print name' }).fill(this.newItemName + 'test0');
    await this.logged.page.locator('.styles_fl-lbl-title__QyKux').nth(0).click();
    await this.logged.page.locator('.styles_category-dropdown-item__cy1f4').nth(1).click();
    await screenshotFunc(this.logged.page, testInfo);
  }

  // Multiple subcategories
  else if (this.getTotalCountOfSubCategory > 1) {
    for (let i = 0; i < this.getTotalCountOfSubCategory; i++) {
      console.log(`🔁 Processing subcategory ${i + 1} of ${this.getTotalCountOfSubCategory}`);
      await this.logged.page.waitForTimeout(1000);

      // Scroll subcategory label into view
      const subCatLabelText = await this.logged.page.locator('label.styles_lbl-name__OQeHI').nth(i).textContent();

      await this.logged.page.evaluate((labelText) => {
        const target = [...document.querySelectorAll('.styles_subcat-container__7Qnms *')].find(el => el.textContent?.includes(labelText || ''));
        target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, subCatLabelText);

      const value = `Item${String(i + 1).padStart(2, '0')}`;

      // Re-fetch locators inside the loop to avoid staleness
      const nameBox = this.logged.page.getByRole('textbox', { name: 'Enter name' }).nth(i);
      const pluBox = this.logged.page.getByPlaceholder('Enter PLU').nth(i);
      const printNameBox = this.logged.page.getByRole('textbox', { name: 'Enter print name' }).nth(i);
      const sizeDropdown = this.logged.page.locator('.styles_fl-lbl-title__QyKux').nth(i);

      await nameBox.waitFor();
      await nameBox.click();
      await nameBox.press('ControlOrMeta+a');
      await nameBox.fill(this.newItemName + value);

      await pluBox.waitFor();
      await pluBox.click();
      await pluBox.fill(this.newItemName + value);

      await printNameBox.waitFor();
      await printNameBox.click();
      await printNameBox.press('ControlOrMeta+a');
      await printNameBox.fill(this.newItemName + value);

      // Open size group dropdown
      await sizeDropdown.waitFor();
      await sizeDropdown.click();

      await this.logged.page.locator('div[class*="styles_main__oURzC"]').nth(i).locator('a[class*="styles_category-dropdown-item__cy1f4"][class*="dropdown-item"]').nth(i+1).click();
      await screenshotFunc(this.logged.page, testInfo);
    }
  }
}


  async setItemPrice(screenshotFunc: (loggedPage: Page, testInfo: any) => Promise<void>, testInfo: any): Promise<void> {
    await this.logged.page.getByRole('button', { name: 'Next', exact: true }).click();
    await this.logged.page.waitForTimeout(3000);

    // Set random price for each sub-category
    for (let i = 0; i < this.getTotalCountOfSubCategory; i++) {
      await this.logged.page.locator('.styles_subcat-dropdown-toggle___fLvQ').nth(0).click();
      await this.logged.page.locator('.styles_subcat-dropdown-item__ZKhXX').nth(i).click();
      const randomPrice = String(Math.floor(Math.random() * 90) + 10); // generates 10–99
      await this.logged.page.locator(`input[name="presets.${i}.SellPrice"]`).fill(randomPrice);
      await screenshotFunc(this.logged.page, testInfo);
    }
  }

  async setItemImage(screenshotFunc: (loggedPage: Page, testInfo: any) => Promise<void>, testInfo: any): Promise<void> {
    await this.logged.page.getByRole('button', { name: 'Next', exact: true }).click();
    await this.logged.page.waitForTimeout(1000);
    await this.logged.page.locator('.styles_img-grid__rcWJb img').nth(0);
    await screenshotFunc(this.logged.page, testInfo);
  }

  async ingredientsSubCategorySelector(screenshotFunc: (loggedPage: Page, testInfo: any) => Promise<void>, testInfo: any): Promise<void> {
    await this.logged.page.getByRole('button', { name: 'Next', exact: true }).click();
    await this.logged.page.waitForTimeout(1000);
    for (let i = 0; i < this.getTotalCountOfSubCategory; i++) {
      await this.logged.page.locator('.styles_subcat-dropdown-toggle___fLvQ').nth(1).click();
      await this.logged.page.locator('.extras_container__mKVUY a').nth(i).click();

    // Open and select largest from combobox
    const combo = this.logged.page.getByRole('combobox');
    await combo.click();

    const optionElements = combo.locator('option');
    const texts = await optionElements.allTextContents();

    let maxValue = -1;
    let selectedLabel = '';

    for (const text of texts) {
      const match = text.match(/\((\d+)\)/);
      if (match) {
        const num = parseInt(match[1]);
        if (num > maxValue) {
          maxValue = num;
          selectedLabel = text;
        }
      }
    }

    if (selectedLabel) {
      await combo.selectOption({ label: selectedLabel });
    }

    // Select 5 extras sequentially
    for (let i = 0; i < 5; i++) {
      const locator = this.logged.page.locator(`label[for='extras-${i}']`);
      await locator.click();
    }
    await screenshotFunc(this.logged.page, testInfo);
    }
  }

  async createItemAddModifiers(count = 3, screenshotFunc: (loggedPage: Page, testInfo: any) => Promise<void>,  testInfo: any): Promise<void> {
    await this.logged.page.getByRole('button', { name: 'Next', exact: true }).click();
    await this.logged.page.waitForTimeout(1000);
    for (let i = 0; i < count; i++) {
      const modifier = this.logged.page.locator("div.col-2.modal-item-option-right-button > button").first();
      if (await modifier.count() > 0 && await modifier.isVisible()) {
        await modifier.click();
      } else {
        break;
      }
    }
    await screenshotFunc(this.logged.page, testInfo);
  }

  // Menuset selection
  async createSelectMenuSet (screenshotFunc: (loggedPage: Page, testInfo: any) => Promise<void>, testInfo: any): Promise<void> {
    await this.logged.page.getByRole('button', { name: 'Next', exact: true }).click();
    await this.logged.page.waitForTimeout(1000);

    if (this.getTotalCountOfSubCategory === 1) {
    // Single subcategory
      await this.logged.page.locator('.menuSetTab_container__w_ugj button').nth(0).click();
      await this.logged.page.waitForTimeout(1000);
      const menusetLocator = this.logged.page.locator('.menuSetTab_container__w_ugj').locator('div').nth(8).locator('a').count();
      const randomMenusetIndex = Math.floor(Math.random() * await menusetLocator);
      await this.logged.page.locator('.menuSetTab_container__w_ugj').locator('div').nth(8).locator('a').nth(randomMenusetIndex + 1).click();
      this.menusetName = (await this.logged.page.locator('.menuSetTab_container__w_ugj button span').nth(0).textContent()) ?? '';

      // menu category selection
      await this.logged.page.locator('.menuSetTab_container__w_ugj button').nth(1).click();
      await this.logged.page.waitForTimeout(1000);
      const menuCategoryLocator = this.logged.page.locator('.menuSetTab_container__w_ugj').locator('div').nth(11).locator('a').count();
      const randomMenuCategoryIndex = Math.floor(Math.random() * await menuCategoryLocator) ;
      await this.logged.page.locator('.menuSetTab_container__w_ugj').locator('div').nth(11).locator('a').nth(randomMenuCategoryIndex + 1).click();
      this.menuCategoryName = (await this.logged.page.locator('.menuSetTab_container__w_ugj button span').nth(1).textContent()) ?? '';
      await screenshotFunc(this.logged.page, testInfo);
    }

  // Multiple subcategories
    else if (this.getTotalCountOfSubCategory > 1) {
        await this.logged.page.getByRole('tabpanel', { name: 'Menu' }).getByRole('checkbox').check();

        // menuset selection
        await this.logged.page.locator('.menuSetTab_container__w_ugj button').nth(0).click();
        await this.logged.page.waitForTimeout(1000);
        const menusetLocator = await this.logged.page.locator('.menuSetTab_container__w_ugj').locator('div').nth(8).locator('a').count();
        const randomMenusetIndex = Math.floor(Math.random() * menusetLocator);
        await this.logged.page.locator('.menuSetTab_container__w_ugj').locator('div').nth(8).locator('a').nth(randomMenusetIndex + 1).click();
        this.menusetName = (await this.logged.page.locator('.menuSetTab_container__w_ugj button span').nth(0).textContent()) ?? '';
        await this.logged.page.waitForTimeout(1000);

        // menu category selection
        await this.logged.page.locator('.menuSetTab_container__w_ugj button').nth(1).click();
        await this.logged.page.waitForTimeout(1000);
        const menuCategoryLocator = await this.logged.page.locator('.menuSetTab_container__w_ugj').locator('div').nth(11).locator('a').count();
        const randomMenuCategoryIndex = Math.floor(Math.random() * menuCategoryLocator);
        await this.logged.page.locator('.menuSetTab_container__w_ugj').locator('div').nth(11).locator('a').nth(randomMenuCategoryIndex + 1).click();
        await this.logged.page.waitForTimeout(1000);
        this.menuCategoryName = (await this.logged.page.locator('.menuSetTab_container__w_ugj button span').nth(1).textContent()) ?? '';
        // locator('.menuSetTab_container__w_ugj button span')
        await screenshotFunc(this.logged.page, testInfo);
    }
    await this.logged.page.getByRole('button', { name: 'Finish' }).click();
  }

async checkItemInMenuset(screenshotFunc: (loggedPage: Page, testInfo: any) => Promise<void>, testInfo: any): Promise<string> {
  await this.logged.page.getByRole('button', { name: 'Finish' }).click();
  await this.logged.page.getByRole('tab', { name: 'Menus' }).click();

  await this.logged.page.locator('#dropdown-integration-selector').click();
  await this.logged.page.waitForTimeout(3000);

  // Check if menuset exists
  const menusetLocators = this.logged.page.locator('.menuset_text__P1Po3');
  const menusetCount = await menusetLocators.count();

  let menusetFound = false;

  for (let i = 0; i < menusetCount; i++) {
    const text = await menusetLocators.nth(i).textContent();
    if (text?.trim() === this.menusetName) {
      await menusetLocators.nth(i).click();
      await this.logged.page.waitForTimeout(3000);
      const message = `Menuset Match Found: ${this.menusetName}`;
      this.logged.logToFile(message);
      menusetFound = true;
      break;
    }
  }

  if (!menusetFound) {
    const message = `Menuset Not Found: ${this.menusetName}`;
    this.logged.logToFile(message);
    // Optionally return early here if category check depends on menuset selection
    // return message;
  }

  // Check if menu category exists
  const categoryButtons = this.logged.page.locator(".categories_cate-item__bgKcv");
  const categoryCount = await categoryButtons.count();

  let categoryFound = false;

  for (let j = 0; j < categoryCount; j++) {
    const text = await categoryButtons.nth(j).textContent();
    if (text?.trim() === this.menuCategoryName) {
      await categoryButtons.nth(j).click();
      await this.logged.page.waitForTimeout(3000);
      await this.logged.page.locator('.category_responsive-table-list__ab4GZ').nth(j).locator('.item_card-content__P1aOO').last().scrollIntoViewIfNeeded();
      await screenshotFunc(this.logged.page, testInfo);
      const message = `Menu Category Match Found: ${this.menuCategoryName}`;
      this.logged.logToFile(message);
      categoryFound = true;
      break;
    }
  }

  if (!categoryFound) {
    const message = `Menu Category "${this.menuCategoryName}" was not found after creation.`;
    this.logged.logToFile(message);
    // Optionally return here
    // return message;
  }

  // Optional final check or return
  if (menusetFound && categoryFound) {
    return `Success: Menuset "${this.menusetName}" and Category "${this.menuCategoryName}" matched.`;
  } else if (menusetFound) {
    return `Partial Success: Menuset found, but category "${this.menuCategoryName}" not found.`;
  } else {
    return `Failure: Menuset "${this.menusetName}" not found.`;
  }


}


}// class end

