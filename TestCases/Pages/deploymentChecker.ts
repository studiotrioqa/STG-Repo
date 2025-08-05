import { Page, Locator } from '@playwright/test';

export class DeploymentChecker {
  constructor(private page: Page) {}

  //Navigates to the deployments page and filters by current store.

  async openAndFilterDeployments(): Promise<void> {
    await this.page.goto(process.env.STG_DEPLOYMENTS_URL as string);
    await this.page.waitForURL('**/deployment-log'); // Replace with your actual path
    await this.page.getByText('Deployment Log').waitFor(); // Replace with your actual path

    await this.page.getByRole('checkbox', {
      name: 'Only show deployments for',
    }).check();
    await this.page.waitForTimeout(10000);

    // Wait for a key UI element to confirm Studio has loaded
    // await this.page.locator('.rdt_TableBody').waitFor(); // put here the locator
  }

  // Checks deployment statuses for a given store and throws if any are "In Progress".
  async assertNoInProgressDeployment(storeName: string): Promise<void> {
    const deploymentsList: Locator = this.page.locator('.rdt_TableRow');
    const count = await deploymentsList.count();

    for (let i = 0; i < count; i++) {
      const row = deploymentsList.nth(i);
      const hasStore = await row.locator('.rdt_TableCell', {
        hasText: storeName
      }).count();

      if (hasStore > 0) {
        const statusCell = row.locator('[data-column-id="status"] label');
        const statusText = await statusCell.textContent();

        if (statusText?.trim().toLowerCase() === 'in progress') {
          throw new Error(`Deployment for "${storeName}" is still in progress (row ${i + 1})`);
        }
      }
    }
  }

  // Navigates back to Studio after deployment checks.
  async returnToStudio(): Promise<void> {
    await this.page.goto(process.env.STG_STUDIO_URL as string);
    await this.page.waitForURL('**/menu-manager/items'); // Replace with your actual path

    // Wait for a key UI element to confirm Studio has loaded
    // await this.page.locator('#btn-store-selector').nth(0).waitFor(); // put here the locator
  }
}
