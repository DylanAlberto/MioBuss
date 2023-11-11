import { ParameterType } from '@aws-sdk/client-ssm';
import { EnvironmentVariableType } from '@aws-sdk/client-codebuild';
import { getOrCreateAppClient, getOrCreateUserPool } from './src/cognito';
import { putParameter } from './src/parameterStore';
import { getOrCreateCodeStarConnection } from './src/codestar';
import { createBackendRole } from './src/iam';
import { createBucket } from './src/s3';
import { createCodeBuildProject } from './src/codebuild';
import createBackendPipeline from './src/backendPipeline';
import dotenv from 'dotenv';

dotenv.config({ path: `./.env.${process.env.NODE_ENV || 'dev'}` });

const poolName = process.env.USER_POOL_NAME || 'mio-buss-user-pool-dev';
const appClientName = process.env.USER_POOL_CLIENT_NAME || 'mio-buss-client-dev';
const connectionName = process.env.CODESTAR_CONNECTION_NAME || 'mio-buss-connection-dev';
const artifactsBucketName = process.env.ARTIFACTS_BUCKET_NAME || '';
const githubRepoUrl = process.env.GITHUB_REPO_URL || 'https://github.com/DylanAlberto/MioBuss';
const codeBuildProjectName = process.env.CODEBUILD_PROJECT_NAME || 'mio-buss-codebuild-dev';

const parameters: {
  name: string;
  value: string;
  type: ParameterType;
}[] = [];

(async () => {
  try {
    const userPoolId = await getOrCreateUserPool(poolName);
    console.log('User Pool ID:', userPoolId);

    const appClientId = await getOrCreateAppClient(userPoolId, appClientName);
    console.log('App Client ID:', appClientId);

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

    const artifactsBucketExist = await createBucket(artifactsBucketName);
    if (!artifactsBucketExist) {
      throw new Error('Artifacts bucket not found');
    }

    const connectionArn = await getOrCreateCodeStarConnection(connectionName);
    if (!connectionArn) {
      throw new Error('CodeStar Connection not found');
    }

    const backendPipelineRole = await createBackendRole({ artifactsBucketName });
    if (!backendPipelineRole) {
      throw new Error('Backend role not found');
    }

    const codebuildProject = await createCodeBuildProject({
      role: backendPipelineRole,
      projectName: codeBuildProjectName,
      codeStarConnectionArn: connectionArn,
      githubRepoUrl,
      artifactsBucketName,
      environmentVariables: parameters.map((param) => ({
        ...param,
        type: EnvironmentVariableType.PARAMETER_STORE,
      })),
    });
    if (!codebuildProject) {
      throw new Error('Codebuild project not found');
    }

    const backendPipeline = await createBackendPipeline({
      artifactsBucketName,
      role: backendPipelineRole,
      codeBuildProjectName,
    });
    console.log('Backend Pipeline Created:', backendPipeline.pipeline?.name);

    await Promise.all(
      parameters.map((param) => putParameter(param.name, param.value, param.type)) as any,
    );
  } catch (error) {
    console.error('Error:', error);
  }
})();
