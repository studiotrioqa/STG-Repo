import * as dotenv from 'dotenv';

dotenv.config();

export const stgLoginCredentials = {
  email: process.env.STG_CUENZ_CREDS_EMAIL || '',
  password: process.env.STG_CUENZ_CREDS_PASSWORD || ''
};

export const stgStudioUrl = process.env.STG_STUDIO_URL || '';
export const stgDeploymentsUrl = process.env.STG_DEPLOYMENTS_URL || '';