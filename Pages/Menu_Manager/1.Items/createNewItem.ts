import { Page } from '@playwright/test';

export class CreateNewItem {
  private newItemName: string = '';
  private getTotalCountOfSubCategory: number = 0;
  private menusetName: string = '';
  private menuCategoryName: string = '';

  constructor(private page: Page, private timestamp: string = '') {}

  // Click on the '+' button to create a new item
  async clickCreateNewItemButton(): Promise<void> {
    await this.page.getByText('+').click();
    await this.page.locator('.select__control').click();
  }

  // Select random category from the dropdown
  async categorySelection(testInfo: any): Promise<void> {
    const categorySelection = this.page.locator('.select__menu > div > div');
    const getTotalCountOfCategory = await categorySelection.count();
    const randomCategoryIndex = Math.floor(Math.random() * getTotalCountOfCategory);
    const indexValue = await this.page.locator('.select__menu > div > div').nth(randomCategoryIndex).locator('div div span').nth(0).textContent();
    await this.page.locator('.select__menu > div > div').nth(randomCategoryIndex).locator('div div span').nth(0).click();
    this.newItemName = 'NIN' + String(this.timestamp).replace(/[^a-zA-Z0-9]/g, '');
    await this.page.locator('input[name="display_name"]').fill(this.newItemName);
    await this.page.locator('textarea[name="description"]').fill('test description - ' + this.timestamp);
    await this.page.getByText('Disable from All Promotions').click();
    await this.page.getByRole('button', { name: 'Next', exact: true }).click();
  }

  // Create item(s) based on the number of sub-categories
 async createItemBasedOnSubCategory( testInfo: any): Promise<void> {

  const subCategoryContainer = this.page.locator('.styles_main__oURzC');
  this.getTotalCountOfSubCategory = await subCategoryContainer.count();

  if (this.getTotalCountOfSubCategory === 1) {
    // Single subcategory
    await this.page.waitForTimeout(3000);
    await this.page.getByRole('textbox', { name: 'Enter name' }).click();
    await this.page.getByRole('textbox', { name: 'Enter name' }).press('ControlOrMeta+a');
    await this.page.getByRole('textbox', { name: 'Enter name' }).fill(this.newItemName + 'test0');
    await this.page.getByPlaceholder('Enter PLU').nth(0).fill(this.newItemName + 'test0');
    await this.page.getByRole('textbox', { name: 'Enter print name' }).click();
    await this.page.getByRole('textbox', { name: 'Enter print name' }).press('ControlOrMeta+a');
    await this.page.getByRole('textbox', { name: 'Enter print name' }).fill(this.newItemName + 'test0');
    await this.page.locator('.styles_fl-lbl-title__QyKux').nth(0).click();
    await this.page.locator('.styles_category-dropdown-item__cy1f4').nth(1).click();

  }

  // Multiple subcategories
  else if (this.getTotalCountOfSubCategory > 1) {
    for (let i = 0; i < this.getTotalCountOfSubCategory; i++) {
      console.log(`🔁 Processing subcategory ${i + 1} of ${this.getTotalCountOfSubCategory}`);
      await this.page.waitForTimeout(1000);

      // Scroll subcategory label into view
      const subCatLabelText = await this.page.locator('label.styles_lbl-name__OQeHI').nth(i).textContent();

      await this.page.evaluate((labelText) => {
        const target = [...document.querySelectorAll('.styles_subcat-container__7Qnms *')].find(el => el.textContent?.includes(labelText || ''));
        target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, subCatLabelText);

      const value = `Item${String(i + 1).padStart(2, '0')}`;

      // Re-fetch locators inside the loop to avoid staleness
      const nameBox = this.page.getByRole('textbox', { name: 'Enter name' }).nth(i);
      const pluBox = this.page.getByPlaceholder('Enter PLU').nth(i);
      const printNameBox = this.page.getByRole('textbox', { name: 'Enter print name' }).nth(i);
      const sizeDropdown = this.page.locator('.styles_fl-lbl-title__QyKux').nth(i);

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
      await this.page.locator('div[class*="styles_main__oURzC"]').nth(i).locator('a[class*="styles_category-dropdown-item__cy1f4"][class*="dropdown-item"]').nth(i+1).click();
  
    }
  }
}


  async setItemPrice(testInfo: any): Promise<void> {
    await this.page.getByRole('button', { name: 'Next', exact: true }).click();
    await this.page.waitForTimeout(3000);

    // Set random price for each sub-category
    for (let i = 0; i < this.getTotalCountOfSubCategory; i++) {
      await this.page.locator('.styles_subcat-dropdown-toggle___fLvQ').nth(0).click();
      await this.page.locator('.styles_subcat-dropdown-item__ZKhXX').nth(i).click();
      const randomPrice = String(Math.floor(Math.random() * 90) + 10); // generates 10–99
      await this.page.locator(`input[name="presets.${i}.SellPrice"]`).fill(randomPrice);
  
    }
  }

  async setItemImage(testInfo: any): Promise<void> {
    await this.page.getByRole('button', { name: 'Next', exact: true }).click();
    // await this.page.waitForTimeout(1000);
    await this.page.locator('.styles_img-grid__rcWJb img').nth(0);

  }

  async ingredientsSubCategorySelector(testInfo: any): Promise<void> {
    await this.page.getByRole('button', { name: 'Next', exact: true }).click();
    // await this.page.waitForTimeout(1000);
    for (let i = 0; i < this.getTotalCountOfSubCategory; i++) {
      await this.page.locator('.styles_subcat-dropdown-toggle___fLvQ').nth(1).click();
      await this.page.locator('.extras_container__mKVUY a').nth(i).click();

    // Open and select largest from combobox
    const combo = this.page.getByRole('combobox');
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
      const locator = this.page.locator(`label[for='extras-${i}']`);
      await locator.click();
    }

    }
  }

  async createItemAddModifiers(count = 3,  testInfo: any): Promise<void> {
    await this.page.getByRole('button', { name: 'Next', exact: true }).click();
    // await this.page.waitForTimeout(1000);
    for (let i = 0; i < count; i++) {
      const modifier = this.page.locator("div.col-2.modal-item-option-right-button > button").first();
      if (await modifier.count() > 0 && await modifier.isVisible()) {
        await modifier.click();
      } else {
        break;
      }
    }

  }

  // Menuset selection
  async createSelectMenuSet (testInfo: any): Promise<void> {
    await this.page.getByRole('button', { name: 'Next', exact: true }).click();
    await this.page.waitForTimeout(1000);

    if (this.getTotalCountOfSubCategory === 1) {
    // Single subcategory
      await this.page.locator('.menuSetTab_container__w_ugj button').nth(0).click();
      // await this.page.waitForTimeout(1000);
      const menusetLocator = this.page.locator('.menuSetTab_container__w_ugj').locator('div').nth(8).locator('a').count();
      const randomMenusetIndex = Math.floor(Math.random() * await menusetLocator);
      await this.page.locator('.menuSetTab_container__w_ugj').locator('div').nth(8).locator('a').nth(randomMenusetIndex + 1).click();
      this.menusetName = (await this.page.locator('.menuSetTab_container__w_ugj button span').nth(0).textContent()) ?? '';

      // menu category selection
      await this.page.locator('.menuSetTab_container__w_ugj button').nth(1).click();
      // await this.page.waitForTimeout(1000);
      const menuCategoryLocator = this.page.locator('.menuSetTab_container__w_ugj').locator('div').nth(11).locator('a').count();
      const randomMenuCategoryIndex = Math.floor(Math.random() * await menuCategoryLocator) ;
      await this.page.locator('.menuSetTab_container__w_ugj').locator('div').nth(11).locator('a').nth(randomMenuCategoryIndex + 1).click();
      this.menuCategoryName = (await this.page.locator('.menuSetTab_container__w_ugj button span').nth(1).textContent()) ?? '';
  
    }

  // Multiple subcategories
    else if (this.getTotalCountOfSubCategory > 1) {
        await this.page.getByRole('tabpanel', { name: 'Menu' }).getByRole('checkbox').check();

        // menuset selection
        await this.page.locator('.menuSetTab_container__w_ugj button').nth(0).click();
        // await this.page.waitForTimeout(1000);
        const menusetLocator = await this.page.locator('.menuSetTab_container__w_ugj').locator('div').nth(8).locator('a').count();
        const randomMenusetIndex = Math.floor(Math.random() * menusetLocator);
        await this.page.locator('.menuSetTab_container__w_ugj').locator('div').nth(8).locator('a').nth(randomMenusetIndex + 1).click();
        this.menusetName = (await this.page.locator('.menuSetTab_container__w_ugj button span').nth(0).textContent()) ?? '';
        // await this.page.waitForTimeout(1000);

        // menu category selection
        await this.page.locator('.menuSetTab_container__w_ugj button').nth(1).click();
        // await this.page.waitForTimeout(1000);
        const menuCategoryLocator = await this.page.locator('.menuSetTab_container__w_ugj').locator('div').nth(11).locator('a').count();
        const randomMenuCategoryIndex = Math.floor(Math.random() * menuCategoryLocator);
        await this.page.locator('.menuSetTab_container__w_ugj').locator('div').nth(11).locator('a').nth(randomMenuCategoryIndex + 1).click();
        // await this.page.waitForTimeout(1000);
        this.menuCategoryName = (await this.page.locator('.menuSetTab_container__w_ugj button span').nth(1).textContent()) ?? '';
        // locator('.menuSetTab_container__w_ugj button span')
    
    }
    await this.page.getByRole('button', { name: 'Finish' }).click();
  }

async checkItemInMenuset(testInfo: any): Promise<string> {
    await this.page.getByRole('button', { name: 'Finish' }).click();
    await this.page.getByRole('tab', { name: 'Menus' }).click();

    await this.page.locator('#dropdown-integration-selector').click();
    // await this.page.waitForTimeout(3000);

    // Check if menuset exists
    const menusetLocators = this.page.locator('.menuset_text__P1Po3');
    const menusetCount = await menusetLocators.count();

    let menusetFound = false;

    for (let i = 0; i < menusetCount; i++) {
      const text = await menusetLocators.nth(i).textContent();
      if (text?.trim() === this.menusetName) {
        await menusetLocators.nth(i).click();
        await this.page.waitForTimeout(3000);
        const message = `Menuset Match Found: ${this.menusetName}`;
        console.log(message); // replaced this.logged.logToFile(...)
        menusetFound = true;
        break;
      }
    }

    if (!menusetFound) {
      const message = `Menuset Not Found: ${this.menusetName}`;
      console.log(message); // replaced this.logged.logToFile(...)
      // Optionally return early here if category check depends on menuset selection
      // return message;
    }

    // Check if menu category exists
    const categoryButtons = this.page.locator(".categories_cate-item__bgKcv");
    const categoryCount = await categoryButtons.count();

    let categoryFound = false;

    for (let j = 0; j < categoryCount; j++) {
      const text = await categoryButtons.nth(j).textContent();
      if (text?.trim() === this.menuCategoryName) {
        await categoryButtons.nth(j).click();
        await this.page.waitForTimeout(3000);
        await this.page.locator('.category_responsive-table-list__ab4GZ').nth(j).locator('.item_card-content__P1aOO').last().scrollIntoViewIfNeeded();
    
        const message = `Menu Category Match Found: ${this.menuCategoryName}`;
        console.log(message); // replaced this.logged.logToFile(...)
        categoryFound = true;
        break;
      }
    }

    if (!categoryFound) {
      const message = `Menu Category "${this.menuCategoryName}" was not found after creation.`;
      console.log(message); // replaced this.logged.logToFile(...)
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

