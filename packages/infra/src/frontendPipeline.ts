import { CreatePipelineCommandInput } from '@aws-sdk/client-codepipeline';
import { createPipeline } from './codepipeline';
import { Role } from '@aws-sdk/client-iam';

async function createFrontendPipeline({
  artifactsBucketName,
  role,
  codeBuildProjectName,
  codestarConnectionArn,
  githubRepoUrl,
  webAppBucketName,
  pipelineName,
}: {
  artifactsBucketName: string;
  role: Role;
  codeBuildProjectName: string;
  codestarConnectionArn: string;
  githubRepoUrl: string;
  webAppBucketName: string;
  pipelineName: string;
}) {
  const params: CreatePipelineCommandInput = {
    pipeline: {
      name: pipelineName,
      roleArn: role.Arn,
      artifactStore: {
        type: 'S3',
        location: artifactsBucketName,
      },
      stages: [
        {
          name: 'Source',
          actions: [
            {
              name: 'Source',
              actionTypeId: {
                category: 'Source',
                owner: 'AWS',
                provider: 'CodeStarSourceConnection',
                version: '1',
              },
              outputArtifacts: [{ name: 'SourceOutput' }],
              configuration: {
                ConnectionArn: codestarConnectionArn,
                FullRepositoryId: githubRepoUrl.split('github.com/')[1],
                BranchName: 'main',
              },
              runOrder: 1,
            },
          ],
        },
        {
          name: 'Build',
          actions: [
            {
              name: 'Build',
              actionTypeId: {
                category: 'Build',
                owner: 'AWS',
                provider: 'CodeBuild',
                version: '1',
              },
              inputArtifacts: [{ name: 'SourceOutput' }],
              outputArtifacts: [{ name: 'BuildOutput' }],
              configuration: {
                ProjectName: codeBuildProjectName,
              },
              runOrder: 1,
            },
          ],
        },
        {
          name: 'Deploy',
          actions: [
            {
              name: 'Deploy',
              actionTypeId: {
                category: 'Deploy',
                owner: 'AWS',
                provider: 'S3',
                version: '1',
              },
              inputArtifacts: [{ name: 'BuildOutput' }],
              configuration: {
                BucketName: webAppBucketName,
                Extract: 'true',
              },
              runOrder: 1,
            },
          ],
        },
      ],
    },
  };

  const pipeline = await createPipeline({
    params,
  });

  return pipeline;
}

export default createFrontendPipeline;
