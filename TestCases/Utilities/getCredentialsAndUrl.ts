// STUDIO URLS
export const prodStudioUrl = 'https://my.deliverit.com.au/';
export const prodDeploymentsUrl = 'https://my.deliverit.com.au/deployment-log';
import * as dotenv from 'dotenv';
dotenv.config();

export const stgLoginCredentials = {
  email: process.env.STG_EMAIL || '',
  password: process.env.STG_PASSWORD || ''
};

export const stgStudioUrl = process.env.STG_STUDIO_URL || '';
export const stgDeploymentsUrl = process.env.STG_DEPLOYMENTS_URL || '';