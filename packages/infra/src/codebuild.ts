import {
  CreateProjectCommand,
  DeleteProjectCommand,
  DeleteProjectCommandInput,
  EnvironmentVariableType,
} from '@aws-sdk/client-codebuild';
import { Role } from '@aws-sdk/client-iam';
import { codebuild } from './awsSDK';

interface BuildSpec {
  version: string;
  phases: {
    install?: {
      'runtime-versions': {
        nodejs: string;
      };
      commands: string[];
    };
    pre_build?: {
      commands: string[];
    };
    build: {
      commands: string[];
    };
    post_build?: {
      commands: string[];
    };
  };
  cache?: {
    paths: string[];
  };
}

async function createCodeBuildProject({
  role,
  projectName,
  artifactsBucketName,
}: {
  role: Role;
  projectName: string;
  artifactsBucketName: string;
}) {
  const buildSpec: BuildSpec = {
    version: '0.2',
    phases: {
      install: {
        'runtime-versions': {
          nodejs: '18',
        },
        commands: [
          'echo Installing pnpm...',
          'npm install -g pnpm',
          'echo Installing serverless...',
          'npm install -g serverless',
          'echo Installing dependencies...',
          'pnpm i',
        ],
      },
      build: {
        commands: ['cd packages/backend', 'sls deploy -s dev'],
      },
    },
  };

  const command = new CreateProjectCommand({
    name: projectName,
    serviceRole: role.Arn,
    source: {
      type: 'CODEPIPELINE',
      buildspec: JSON.stringify(buildSpec),
    },
    artifacts: {
      type: 'CODEPIPELINE',
      packaging: 'ZIP',
      namespaceType: 'BUILD_ID',
      name: artifactsBucketName,
    },
    environment: {
      type: 'LINUX_CONTAINER',
      image: 'aws/codebuild/standard:7.0',
      computeType: 'BUILD_GENERAL1_SMALL',
    },
  });

  const params: DeleteProjectCommandInput = {
    name: projectName,
  };

  try {
    await codebuild.send(new DeleteProjectCommand(params));
    console.log(`* Project ${projectName} deleted.`);
  } catch (error: any) {
    console.log(error);
    console.error('* Error deleting codebuild project:', error);
    throw error;
  }

  try {
    const response = await codebuild.send(command);
    console.log('* Codebuild project created');
    return response.project;
  } catch (error: any) {
    console.error('* Error creating codebuild project:', error);
    throw error;
  }
}

export { createCodeBuildProject };
