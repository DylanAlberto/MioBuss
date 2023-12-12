import { codepipeline } from './awsSDK';
import {
  CreatePipelineCommandInput,
  CreatePipelineCommand,
  DeletePipelineCommandInput,
  DeletePipelineCommand,
} from '@aws-sdk/client-codepipeline';
import { Role } from '@aws-sdk/client-iam';

async function createFrontendPipeline({
  artifactsBucketName,
  role,
  codeBuildProjectName,
  codestarConnectionArn,
  githubRepoUrl,
  webAppBucketName,
}: {
  artifactsBucketName: string;
  role: Role;
  codeBuildProjectName: string;
  codestarConnectionArn: string;
  githubRepoUrl: string;
  webAppBucketName: string;
}) {
  const pipelineName = 'FrontendPipeline';
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

  const deleteParams: DeletePipelineCommandInput = {
    name: pipelineName,
  };
  try {
    await codepipeline.send(new DeletePipelineCommand(deleteParams));
    console.log('* Pipeline deleted successfully.');
  } catch (error: any) {
    console.log(error);
    if (error.name === 'PipelineNotFoundException') {
      console.log(`* Pipeline ${pipelineName} doesn't exist.`);
    } else {
      throw error;
    }
  }

  try {
    const command = new CreatePipelineCommand(params);
    const pipeline = await codepipeline.send(command);
    return pipeline;
  } catch (error: any) {
    console.log('* Error creating pipeline:', error);
    throw error;
  }
}

export default createFrontendPipeline;
