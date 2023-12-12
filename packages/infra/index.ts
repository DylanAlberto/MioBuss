import { ParameterType } from '@aws-sdk/client-ssm';
import { getOrCreateAppClient, getOrCreateUserPool } from './src/cognito';
import { putParameter } from './src/parameterStore';
import { getOrCreateCodeStarConnection } from './src/codestar';
import { createBackendRole, createFrontendRole } from './src/iam';
import { createBucket, configureToHostWebApp } from './src/s3';
import { createCodeBuildProject } from './src/codebuild';
import createBackendPipeline from './src/backendPipeline';
import createFrontendPipeline from './src/frontendPipeline';
import dotenv from 'dotenv';

dotenv.config({ path: `./.env.${process.env.NODE_ENV || 'dev'}` });

const poolName = process.env.USER_POOL_NAME || 'mio-buss-user-pool-dev';
const appClientName = process.env.USER_POOL_CLIENT_NAME || 'mio-buss-client-dev';
const connectionName = process.env.CODESTAR_CONNECTION_NAME || 'mio-buss-connection-dev';
const backendArtifactsBucketName = process.env.BACKEND_ARTIFACTS_BUCKET_NAME || '';
const frontendArtifactsBucketName = process.env.FRONTEND_ARTIFACTS_BUCKET_NAME || '';
const githubRepoUrl = process.env.GITHUB_REPO_URL || 'https://github.com/DylanAlberto/MioBuss';
const codeBuildBackendProjectName =
  process.env.CODEBUILD_BACKEND_PROJECT_NAME || 'mio-buss-backend-codebuild-dev';
const codeBuildFrontendProjectName =
  process.env.CODEBUILD_FRONTEND_PROJECT_NAME || 'mio-buss-frontend-codebuild-dev';
const webAppBucketName = process.env.WEBAPP_BUCKET_NAME || '';

const parameters: {
  name: string;
  value: string;
  type: ParameterType;
}[] = [];

const backendInstallCommands = [
  'echo Installing pnpm...',
  'npm install -g pnpm',
  'echo Installing serverless...',
  'npm install -g serverless',
  'echo Installing dependencies...',
  'pnpm i',
];
const backendBuildCommands = ['cd packages/backend', 'sls deploy -s dev'];
const frontendInstallCommands = [
  'echo Installing pnpm...',
  'npm install -g pnpm',
  'echo Installing dependencies...',
  'pnpm i',
];
const frontendBuildCommands = ['pnpm build'];

(async () => {
  try {
    const userPoolId = await getOrCreateUserPool(poolName);
    console.log('* User Pool ID:', userPoolId);

    const appClientId = await getOrCreateAppClient(userPoolId, appClientName);
    console.log('* App Client ID:', appClientId);

    parameters.push({
      name: 'COGNITO_USER_POOL_ID',
      value: userPoolId,
      type: ParameterType.STRING,
    });
    parameters.push({
      name: 'COGNITO_USER_POOL_CLIENT_ID',
      value: appClientId,
      type: ParameterType.STRING,
    });
    parameters.push({
      name: 'AWS_ACCESS_KEY_ID',
      value: process.env.AWS_ACCESS_KEY_ID || '',
      type: ParameterType.STRING,
    });
    parameters.push({
      name: 'AWS_SECRET_ACCESS_KEY',
      value: process.env.AWS_SECRET_ACCESS_KEY || '',
      type: ParameterType.STRING,
    });

    //API
    const backendArtifactsBucketExist = await createBucket(backendArtifactsBucketName);
    if (!backendArtifactsBucketExist) {
      throw new Error('* Backend Artifacts bucket not found');
    }

    const frontendArtifactsBucketExist = await createBucket(frontendArtifactsBucketName);
    if (!frontendArtifactsBucketExist) {
      throw new Error('* Frontend Artifacts bucket not found');
    }

    const connectionArn = await getOrCreateCodeStarConnection(connectionName);
    if (!connectionArn) {
      throw new Error('* CodeStar Connection not found');
    }

    const backendPipelineRole = await createBackendRole({
      artifactsBucketName: backendArtifactsBucketName,
    });
    if (!backendPipelineRole) {
      throw new Error('* Backend role not found');
    }

    const codebuildBackendProject = await createCodeBuildProject({
      role: backendPipelineRole,
      projectName: codeBuildBackendProjectName,
      artifactsBucketName: backendArtifactsBucketName,
      installCommands: backendInstallCommands,
      buildCommands: backendBuildCommands,
    });
    if (!codebuildBackendProject) {
      throw new Error('* Codebuild project not found');
    }

    const backendPipeline = await createBackendPipeline({
      artifactsBucketName: backendArtifactsBucketName,
      role: backendPipelineRole,
      codeBuildProjectName: codeBuildBackendProjectName,
      codestarConnectionArn: connectionArn,
      githubRepoUrl,
    });
    console.log('* Backend Pipeline Created:', backendPipeline.pipeline?.name);

    await Promise.all(
      parameters.map((param) => putParameter(param.name, param.value, param.type)) as any,
    );

    // WebApp
    const frontendRole = await createFrontendRole({
      artifactsBucketName: frontendArtifactsBucketName,
    });
    if (!frontendRole) {
      throw new Error('* Frontend role not found');
    }

    const webAppBucketExist = await createBucket(webAppBucketName, true);
    if (!webAppBucketExist) {
      throw new Error('* WebApp bucket not found');
    }

    await configureToHostWebApp(webAppBucketName);
    console.log('* WebApp bucket configured to host a static web app');

    const codebuildFrontendProject = await createCodeBuildProject({
      role: frontendRole,
      projectName: codeBuildFrontendProjectName,
      artifactsBucketName: frontendArtifactsBucketName,
      installCommands: frontendInstallCommands,
      buildCommands: frontendBuildCommands,
      artifacts: {
        files: ['**/*'],
        'base-directory': './packages/frontend/web/dist',
      },
    });
    if (!codebuildFrontendProject) {
      throw new Error('* Codebuild project not found');
    }

    const frontendPipeline = await createFrontendPipeline({
      artifactsBucketName: frontendArtifactsBucketName,
      role: frontendRole,
      codeBuildProjectName: codeBuildFrontendProjectName,
      codestarConnectionArn: connectionArn,
      githubRepoUrl,
      webAppBucketName,
    });
    console.log('* Frontend Pipeline Created:', frontendPipeline.pipeline?.name);
  } catch (error) {
    console.error('* Error:', error);
  }
})();
