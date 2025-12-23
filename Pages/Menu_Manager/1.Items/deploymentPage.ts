import { Page, Locator } from '@playwright/test';

export class DeploymentPage {
  constructor(private page: Page, private deploymentName?: string) {}

  // Opens the Deployment Log page and filters by store
  async openAndFilterDeployments(): Promise<void> {
    await this.page.goto(process.env.STG_DEPLOYMENTS_URL as string, {
      waitUntil: 'domcontentloaded',
    });
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
    // await this.page.goto(process.env.STG_DEPLOYMENTS_URL as string);
    await this.page.goto(process.env.STG_STUDIO_URL as string, {
      waitUntil: 'domcontentloaded',
    });
    // await this.page.waitForURL('**/menu-manager/items');
  }

  // Opens the Deployment Log page
  async openDeploymentLog(stgDeploymentsUrl: string): Promise<void> {
    await this.page.goto(stgDeploymentsUrl);
    // await this.page.waitForTimeout(10000);
  }

  // Clicks on a deployment row by name
async openDeploymentDetailByName(deploymentName: string): Promise<void> {
  // Step 1: ensure filter is applied
  await this.page.getByRole('checkbox', {
    name: 'Only show deployments for'
  }).check();

  // Wait for table to load
  await this.page.waitForTimeout(5000);

  // Step 2: loop over deployments
  const rows = this.page.locator('.rdt_TableBody [role="row"]');
  const rowCount = await rows.count();

  for (let i = 0; i < rowCount; i++) {
    const row = rows.nth(i);

    // find the "name" cell inside this row
    const nameCell = row.locator('[data-column-id="name"]');
    const nameText = (await nameCell.textContent())?.trim();

    if (nameText === deploymentName) {
      console.log(`🔍 Found deployment: ${nameText}`);

      // locate the status cell
      const statusCell = row.locator('[data-column-id="status"] label');
      let statusText = (await statusCell.textContent())?.trim();

      // Step 3: retry until Success (max 36 refreshes)
      for (let retry = 0; retry < 36; retry++) {
        if (statusText?.toLowerCase() === 'success') {
          console.log(`✅ Deployment "${deploymentName}" is Success. Clicking row...`);
          await row.click();
          return;
        }

        console.log(`⏳ Deployment "${deploymentName}" status: ${statusText}. Retrying...`);

        // refresh table
        await this.page.waitForTimeout(10000);
        await this.page.getByRole('button', { name: 'Reload' }).click();

        // re-check status after refresh
        statusText = (await statusCell.textContent())?.trim();
      }

      throw new Error(`❌ Deployment "${deploymentName}" did not reach Success after retries.`);
    }
  }

  throw new Error(`❌ Deployment "${deploymentName}" not found in table.`);
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
    await this.page.getByRole('button', { name: 'Deploy and Rebuild Website (1)' }).click();

    const nameInput = this.page.getByRole('textbox');
    await this.page.getByRole('button').filter({ hasText: /^$/ }).click();
    await nameInput.press('ControlOrMeta+a');
    await nameInput.fill(this.deploymentName);

    await this.page.getByRole('button').filter({ hasText: /^$/ }).click();

    const storeDeploymentName = await nameInput.inputValue();
    await this.page.getByRole('button', { name: 'Continue Deploy' }).click();
    await this.page.waitForTimeout(1000);
    return storeDeploymentName;
  }
}
