import { Page, Locator } from '@playwright/test';

export async function checkDeploymentStatuses(loggedPage: Page, storeName: string) {
  const getDeploymentsList: Locator = loggedPage.locator('.rdt_TableRow');
  const countDeploymentsList = await getDeploymentsList.count();

  for (let i = 0; i < countDeploymentsList; i++) {
    const deploymentsListResult = getDeploymentsList.nth(i);
    
    // Step 1: Check if this row contains the store name
    const hasStore = await deploymentsListResult.locator('.rdt_TableCell', {
      hasText: storeName
    }).count();

    if (hasStore > 0) {
      // Step 2: Get the status of cells
      const statusCell = deploymentsListResult.locator('[data-column-id="status"] label');
      const statusText = await statusCell.textContent();

      // Step 3: Stop if status is "In Progress"
      if (statusText?.trim().toLowerCase() === 'in progress') {
        throw new Error(`Deployment for "${storeName}" is still in progress (row ${i + 1})`);
      }
    }
  }
}
