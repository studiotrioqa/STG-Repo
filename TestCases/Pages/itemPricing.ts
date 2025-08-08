// deploymentChecker.ts

import { Page, Locator } from '@playwright/test';

export class ItemPlatformPricing {
  constructor(private page: Page) {}

  async goToPricingAndEditPlatformPricing(addPrice: number, getOperation: '+' | '-', screenshotFunc: (page: Page, testInfo: any) => Promise<void>, testInfo: any): Promise<void> {
    // Navigate to pricing tab
    await this.page.getByRole('tab', { name: 'Pricing' }).click();

    // Get current price
    const priceInput = this.page.locator('input[name="SellDPOSShop"]');
    const fieldValue = await priceInput.inputValue();
    const convertedValue = parseFloat(fieldValue.replace(/[^0-9.-]+/g, ''));

    // Calculate and fill new price
    let newPrice: number;
    if (convertedValue < 11) {
      newPrice = convertedValue + addPrice;
    } else {
      newPrice = getOperation === '+' ? convertedValue + addPrice : convertedValue - addPrice;
    }

    await priceInput.fill(newPrice.toFixed());

    // Take screenshot
    await screenshotFunc(this.page, testInfo);

  }
}


export class ItemApplyAllPricing {
  constructor(private page: Page) {}

  async goToPricingAndEditApplyAll(addPrice: number, getOperation: '+' | '-', screenshotFunc: (page: Page, testInfo: any) => Promise<void>, testInfo: any): Promise<void> {
    // Navigate to pricing tab
    await this.page.getByRole('tab', { name: 'Pricing' }).click();
    screenshotFunc(this.page, testInfo);

    // Get current price
    await this.page.locator('input[name="applyAll"]').check();
    const priceInput = this.page.locator('input[name="SellPrice"]');
    const fieldValue = await priceInput.inputValue();
    const convertedValue = parseFloat(fieldValue.replace(/[^0-9.-]+/g, ''));

    // Calculate and fill new price
    let newPrice: number;
    if (convertedValue < 11) {
      newPrice = convertedValue + addPrice;
    } else {
      newPrice = getOperation === '+' ? convertedValue + addPrice : convertedValue - addPrice;
    }

    await priceInput.fill(newPrice.toFixed());
  }
}
