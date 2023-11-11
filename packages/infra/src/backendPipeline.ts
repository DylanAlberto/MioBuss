import { codepipeline } from './awsSDK';
import { CreatePipelineCommandInput, CreatePipelineCommand } from '@aws-sdk/client-codepipeline';
import { Role } from '@aws-sdk/client-iam';

async function createBackendPipeline({
  artifactsBucketName,
  role,
  codeBuildProjectName,
  codestarConnectionArn,
  githubRepoUrl,
}: {
  artifactsBucketName: string;
  role: Role;
  codeBuildProjectName: string;
  codestarConnectionArn: string;
  githubRepoUrl: string;
}) {
  const params: CreatePipelineCommandInput = {
    pipeline: {
      name: 'BackendPipeline',
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
                FullRepositoryId: githubRepoUrl,
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
      ],
    },
  };
  const command = new CreatePipelineCommand(params);
  const pipeline = await codepipeline.send(command);
  return pipeline;
}

export default createBackendPipeline;
