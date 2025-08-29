import { Page, Locator } from '@playwright/test';

export class DeploymentPage {
  constructor(private page: Page, private deploymentName?: string) {}

  // Opens the Deployment Log page and filters by store
  async openAndFilterDeployments(): Promise<void> {
    await this.page.goto(process.env.STG_DEPLOYMENTS_URL as string);
    await this.page.waitForURL('**/deployment-log');
    await this.page.getByText('Deployment Log').waitFor();
    await this.page.getByRole('checkbox', {
      name: 'Only show deployments for'
    }).check();
    await this.page.waitForTimeout(10000);
  }

  // Validates that no deployments are stuck in 'In Progress'
  async assertNoInProgressDeployment(storeName: string): Promise<void> {
    const deploymentsList: Locator = this.page.locator('.rdt_TableRow');
    const count = await deploymentsList.count();

    for (let i = 0; i < count; i++) {
      const row = deploymentsList.nth(i);
      const hasStore = await row.locator('.rdt_TableCell', { hasText: storeName }).count();

      if (hasStore > 0) {
        const statusCell = row.locator('[data-column-id="status"] label');
        const statusText = await statusCell.textContent();

        if (statusText?.trim().toLowerCase() === 'in progress') {
          throw new Error(`Deployment for "${storeName}" is still in progress (row ${i + 1})`);
        }
      }
    }
  }

  // Navigates back to STUDIO
  async returnToStudio(): Promise<void> {
    await this.page.goto(process.env.STG_STUDIO_URL as string);
    await this.page.waitForURL('**/menu-manager/items');
  }

  // Opens the Deployment Log page
  async openDeploymentLog(stgDeploymentsUrl: string): Promise<void> {
    await this.page.goto(stgDeploymentsUrl);
    await this.page.waitForTimeout(10000);
  }

  // Clicks on a deployment row by name
  async openDeploymentDetailByName(deploymentName: string): Promise<void> {
    const matchingCell = this.page.getByRole('cell', { name: deploymentName });

    if ((await matchingCell.count()) > 0 && await matchingCell.isVisible()) {
      await matchingCell.click();
      await this.page.waitForTimeout(5000);
    } else {
      throw new Error(`No matching cell found for deployment name: ${deploymentName}`);
    }
  }

  // Extracts the deployment ID from the detail view
  async getDeploymentId(): Promise<string | null> {
    const idText = await this.page.locator('span.styles_id-value__MH_QF').nth(0).textContent();
    return idText?.trim() || null;
  }

  // Deploys a pending deployment
  async deployItem(): Promise<string> {
    if (!this.deploymentName) throw new Error('Deployment name is not set.');

    await this.page.locator('xpath=//button[@id="deploy-button"]').click();
    await this.page.getByRole('button', { name: 'Next' }).click();
    await this.page.getByRole('button', { name: 'Next' }).click();
    await this.page.getByRole('button', { name: 'Deploy (1)' }).click();

    const nameInput = this.page.getByRole('textbox');
    await this.page.getByRole('button').filter({ hasText: /^$/ }).click();
    await nameInput.press('ControlOrMeta+a');
    await nameInput.fill(this.deploymentName);

    await this.page.getByRole('button').filter({ hasText: /^$/ }).click();

    const storeDeploymentName = await nameInput.inputValue();
    await this.page.getByRole('button', { name: 'Continue Deploy' }).click();
    await this.page.waitForTimeout(3000);
    return storeDeploymentName;
  }
}




// export async function openAndFilterDeployments(page: Page): Promise<void> {
//   await page.goto(process.env.STG_DEPLOYMENTS_URL as string); // Go to the Deployment Log page
//   await page.waitForURL('**/deployment-log'); // and wait for it to load
//   await page.getByText('Deployment Log').waitFor(); // Ensure the Deployment Log text is visible
//   await page.getByRole('checkbox', {
//     name: 'Only show deployments for'
//   }).check(); // Check the checkbox to filter deployments
//   await page.waitForTimeout(10000);
// }

// // Validates that there are no deployments stuck in 'In Progress'
// export async function assertNoInProgressDeployment(page: Page, storeName: string): Promise<void> {
//   const deploymentsList: Locator = page.locator('.rdt_TableRow'); // Locate all deployment rows
//   const count = await deploymentsList.count(); // Get the count of deployment rows

//   // Iterate through each deployment row
//   for (let i = 0; i < count; i++) {
//     const row = deploymentsList.nth(i);
//     const hasStore = await row.locator('.rdt_TableCell', { hasText: storeName }).count();

//     // If the store name is found in the row, check the status
//     if (hasStore > 0) {
//       const statusCell = row.locator('[data-column-id="status"] label');
//       const statusText = await statusCell.textContent();
      
//       // If the status is 'In Progress', throw an error
//       if (statusText?.trim().toLowerCase() === 'in progress') {
//         throw new Error(`Deployment for "${storeName}" is still in progress (row ${i + 1})`);
//       }
//     }
//   }
// }

// // Navigates back to STUDIO if there are no in-progress deployments
// export async function returnToStudio(page: Page): Promise<void> {
//   await page.goto(process.env.STG_STUDIO_URL as string);
//   await page.waitForURL('**/menu-manager/items');
// }


// // Deployment ID Fetcher
// export class DeploymentActions {
//   constructor(private page: Page) {}

//   // Go to Deployment Log page
//   async openDeploymentLog(stgDeploymentsUrl: string): Promise<void> {
//     await this.page.goto(stgDeploymentsUrl);
//     await this.page.waitForTimeout(10000);
//   }

//   // Clicks on a deployment row by matching the deployment name
//   async openDeploymentDetailByName(deploymentName: string): Promise<void> {
//     const matchingCell = this.page.getByRole('cell', { name: deploymentName });

//     if ((await matchingCell.count()) > 0 && await matchingCell.isVisible()) {
//       await matchingCell.click();
//       await this.page.waitForTimeout(5000);
//     } else {
//       throw new Error(`No matching cell found for deployment name: ${deploymentName}`);
//     }
//   }

//   // Extracts the deployment ID from the detail view
//   async getDeploymentId(): Promise<string | null> {
//     const idText = await this.page.locator('span.styles_id-value__MH_QF').textContent();
//     return idText?.trim() || null;
//   }
// }


// // Deploy Pending Deployments
// export class DeployPendingeDeployments {
//   constructor(private page: Page, private deploymentName: string) {}

//   async deployItem(): Promise<string> {
//     await this.page.locator('xpath=//button[@id="deploy-button"]').click();
//     await this.page.getByRole('button', { name: 'Next' }).click();
//     await this.page.getByRole('button', { name: 'Next' }).click();
//     await this.page.getByRole('button', { name: 'Deploy (1)' }).click();

//     // Focus the textbox, select all, and fill with deployment name
//     const nameInput = this.page.getByRole('textbox');
//     await this.page.getByRole('button').filter({ hasText: /^$/ }).click();
//     await nameInput.press('ControlOrMeta+a');
//     await nameInput.fill(this.deploymentName);

//     await this.page.getByRole('button').filter({ hasText: /^$/ }).click();

//     const storeDeploymentName = await nameInput.inputValue(); // Can be returned if needed
//     await this.page.getByRole('button', { name: 'Continue Deploy' }).click();
//     await this.page.waitForTimeout(3000);
//     return storeDeploymentName;
    
//   }
// }