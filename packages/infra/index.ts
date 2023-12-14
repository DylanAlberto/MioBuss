import { ParameterType } from '@aws-sdk/client-ssm';
import { getOrCreateAppClient, getOrCreateUserPool } from './src/cognito';
import { putParameter } from './src/parameterStore';
import { getOrCreateCodeStarConnection } from './src/codestar';
import { createBackendRole, createFrontendRole } from './src/iam';
import { createBucket, configureToHostWebApp } from './src/s3';
import { createCodeBuildProject } from './src/codebuild';
import createBackendPipeline from './src/backendPipeline';
import createFrontendPipeline from './src/frontendPipeline';
import type { parameters } from './src/types';
import * as constants from './src/constants';

const parameters: parameters = [];
(async () => {
  try {
    const userPoolId = await getOrCreateUserPool(constants.poolName);
    console.log('* User Pool ID:', userPoolId);

    const appClientId = await getOrCreateAppClient(userPoolId, constants.appClientName);
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

    //API
    const backendArtifactsBucketExist = await createBucket(constants.backendArtifactsBucketName);
    if (!backendArtifactsBucketExist) {
      throw new Error('* Backend Artifacts bucket not found');
    }

    const frontendArtifactsBucketExist = await createBucket(constants.frontendArtifactsBucketName);
    if (!frontendArtifactsBucketExist) {
      throw new Error('* Frontend Artifacts bucket not found');
    }

    const connectionArn = await getOrCreateCodeStarConnection(constants.connectionName);
    if (!connectionArn) {
      throw new Error('* CodeStar Connection not found');
    }

    const backendPipelineRole = await createBackendRole({
      artifactsBucketName: constants.backendArtifactsBucketName,
      roleName: constants.backendPipelineRoleName,
    });
    if (!backendPipelineRole) {
      throw new Error('* Backend role not found');
    }

    const codebuildBackendProject = await createCodeBuildProject({
      role: backendPipelineRole,
      projectName: constants.codeBuildBackendProjectName,
      artifactsBucketName: constants.backendArtifactsBucketName,
      installCommands: constants.backendInstallCommands,
      buildCommands: constants.backendBuildCommands,
      environmentVariables: constants.backendEnvironmentVariables,
    });
    if (!codebuildBackendProject) {
      throw new Error('* Codebuild project not found');
    }

    const backendPipeline = await createBackendPipeline({
      artifactsBucketName: constants.backendArtifactsBucketName,
      role: backendPipelineRole,
      codeBuildProjectName: constants.codeBuildBackendProjectName,
      codestarConnectionArn: connectionArn,
      githubRepoUrl: constants.githubRepoUrl,
      pipelineName: constants.backendPipelineName,
    });
    console.log('* Backend Pipeline Created:', backendPipeline.pipeline?.name);

    await Promise.all(
      parameters.map((param) => putParameter(param.name, param.value, param.type)) as any,
    );

    // WebApp
    const frontendRole = await createFrontendRole({
      artifactsBucketName: constants.frontendArtifactsBucketName,
      roleName: constants.frontendPipelineRoleName,
    });
    if (!frontendRole) {
      throw new Error('* Frontend role not found');
    }

    const webAppBucketExist = await createBucket(constants.webAppBucketName, true);
    if (!webAppBucketExist) {
      throw new Error('* WebApp bucket not found');
    }

    await configureToHostWebApp(constants.webAppBucketName);
    console.log('* WebApp bucket configured to host a static web app');

    const codebuildFrontendProject = await createCodeBuildProject({
      role: frontendRole,
      projectName: constants.codeBuildFrontendProjectName,
      artifactsBucketName: constants.frontendArtifactsBucketName,
      installCommands: constants.frontendInstallCommands,
      buildCommands: constants.frontendBuildCommands,
      artifacts: {
        files: ['**/*'],
        'base-directory': './packages/frontend/web/dist',
      },
    });
    if (!codebuildFrontendProject) {
      throw new Error('* Codebuild project not found');
    }

    const frontendPipeline = await createFrontendPipeline({
      artifactsBucketName: constants.frontendArtifactsBucketName,
      role: frontendRole,
      codeBuildProjectName: constants.codeBuildFrontendProjectName,
      codestarConnectionArn: connectionArn,
      githubRepoUrl: constants.githubRepoUrl,
      webAppBucketName: constants.webAppBucketName,
      pipelineName: constants.frontendPipelineName,
    });
    console.log('* Frontend Pipeline Created:', frontendPipeline.pipeline?.name);
  } catch (error) {
    console.error('* Error:', error);
  }
})();
