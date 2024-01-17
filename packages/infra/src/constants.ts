import dotenv from 'dotenv';
import type { environmentVariables } from './types';

dotenv.config({ path: `./.env.${process.env.NODE_ENV || 'dev'}` });

export const poolName = process.env.USER_POOL_NAME || 'mio-buss-user-pool-dev';
export const appClientName = process.env.USER_POOL_CLIENT_NAME || 'mio-buss-client-dev';
export const connectionName = process.env.CODESTAR_CONNECTION_NAME || 'mio-buss-connection-dev';
export const backendArtifactsBucketName = process.env.BACKEND_ARTIFACTS_BUCKET_NAME || '';
export const frontendArtifactsBucketName = process.env.FRONTEND_ARTIFACTS_BUCKET_NAME || '';
export const frontendPipelineName = process.env.FRONTEND_PIPELINE_NAME || '';
export const frontendPipelineRoleName = process.env.FRONTEND_PIPELINE_ROLE_NAME || '';
export const backendPipelineName = process.env.BACKEND_PIPELINE_NAME || '';
export const backendPipelineRoleName = process.env.BACKEND_PIPELINE_ROLE_NAME || '';
export const webAppBucketName = process.env.WEBAPP_BUCKET_NAME || '';
export const dbName = process.env.DB_NAME || '';
export const dbMasterUsername = process.env.DB_MASTER_USERNAME || '';
export const dbMasterPassword = process.env.DB_MASTER_PASSWORD || '';
export const backendBuildCommands = ['cd packages/backend', 'sls deploy -s dev'];
export const frontendBuildCommands = ['pnpm build'];
export const githubRepoUrl =
  process.env.GITHUB_REPO_URL || 'https://github.com/DylanAlberto/MioBuss';
export const codeBuildBackendProjectName =
  process.env.CODEBUILD_BACKEND_PROJECT_NAME || 'mio-buss-backend-codebuild-dev';
export const codeBuildFrontendProjectName =
  process.env.CODEBUILD_FRONTEND_PROJECT_NAME || 'mio-buss-frontend-codebuild-dev';
export const backendInstallCommands = [
  'echo Installing pnpm...',
  'npm install -g pnpm',
  'echo Installing serverless...',
  'npm install -g serverless',
  'echo Installing dependencies...',
  'pnpm i',
];
export const frontendInstallCommands = [
  'echo Installing pnpm...',
  'npm install -g pnpm',
  'echo Installing dependencies...',
  'pnpm i',
];
export const backendEnvironmentVariables: environmentVariables = [
  {
    name: 'AWS_ACCESS_KEY_ID',
    value: process.env.AWS_ACCESS_KEY_ID || '',
    type: 'PLAINTEXT',
  },
  {
    name: 'AWS_SECRET_ACCESS_KEY',
    value: process.env.AWS_SECRET_ACCESS_KEY || '',
    type: 'PLAINTEXT',
  },
];
