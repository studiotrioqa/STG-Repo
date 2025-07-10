import { Page } from '@playwright/test';

export const PLUName = 'STP'; // will be used to search for the item in the menu manager
const PLUNumber = ['01','02', '03', '04', '05']; // will be used to search for the item in the menu manager
export const PLU = PLUName + PLUNumber[Math.floor(Math.random() * PLUNumber.length)]; // will be used to search for the item in the menu manager


// Select random PLU to be use in multiple selection
export async function randomlySelectPLU(page: Page) {
  const locator = page.locator('//div[contains(@id, "row-")]'); // Adjust here
  const count = await locator.count();

  if (count < 3) {
    console.log(`Only ${count} elements found. Will click each once.`);
  }

  // Get unique, random indices (up to 3)
  const indices = [...Array(count).keys()];
  const shuffled = indices.sort(() => 0.5 - Math.random()).slice(0, Math.min(3, count));

  for (const index of shuffled) {
    console.log(`Clicking index: ${index}`);
    await locator.nth(index).click();
  }
}