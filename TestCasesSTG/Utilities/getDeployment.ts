import { Page } from '@playwright/test';

export async function clickMatchingCell(page: Page, deploymentName: string){
  const matchingCell = page.getByRole('cell', { name: deploymentName });
  if (await matchingCell.count() > 0 && await matchingCell.isVisible()) {
    await matchingCell.click();
  } else {
    throw new Error(`No matching cell found for deployment name: ${deploymentName}`);
  }
}