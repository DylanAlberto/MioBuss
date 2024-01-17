import { deleteBucket } from './s3';
import { deleteCodeBuildProject } from './codebuild';
import { deletePipeline } from './codepipeline';
import { deleteRole } from './iam';
import { deleteCognitoResources } from './cognito';
import { deleteRDSInstance } from './rds';
import * as constants from './constants';

async function main() {
  await deletePipeline(constants.backendPipelineName);
  await deletePipeline(constants.frontendPipelineName);

  await deleteCodeBuildProject(constants.codeBuildBackendProjectName);
  await deleteCodeBuildProject(constants.codeBuildFrontendProjectName);

  await deleteRole(constants.backendPipelineRoleName);
  await deleteRole(constants.frontendPipelineRoleName);

  await deleteCognitoResources(constants.poolName);

  await deleteBucket(constants.webAppBucketName);
  await deleteBucket(constants.backendArtifactsBucketName);
  await deleteBucket(constants.frontendArtifactsBucketName);
  await deleteRDSInstance(constants.dbName);

  console.log('Todos los recursos han sido eliminados con éxito.');
}

main();
