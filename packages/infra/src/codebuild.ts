import { CreateProjectCommand, EnvironmentVariableType } from '@aws-sdk/client-codebuild';
import { Role } from '@aws-sdk/client-iam';
import { codebuild } from './awsSDK';

interface BuildSpec {
  version: string;
  phases: {
    install?: {
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
  codeStarConnectionArn,
  githubRepoUrl,
  artifactsBucketName,
  environmentVariables,
}: {
  role: Role;
  projectName: string;
  codeStarConnectionArn: string;
  githubRepoUrl: string;
  artifactsBucketName: string;
  environmentVariables: { name: string; value: string; type: EnvironmentVariableType }[];
}) {
  const buildSpec: BuildSpec = {
    version: '0.2',
    phases: {
      install: {
        commands: [
          'echo Installing NVM...',
          'wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash',
          `export NVM_DIR="$HOME/.nvm"
          [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
          [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion`,
          'echo Installing node version...',
          'nvm install 18.17.0',
          'nvm use 18.17.0',
          'echo Installing pnpm...',
          'npm install -g pnpm',
          'echo Installing serverless...',
          'npm install -g serverless',
          'echo Installing dependencies...',
          'pnpm i',
        ],
      },
      build: {
        commands: ['sls deploy -s dev'],
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
      image: 'aws/codebuild/standard:5.0',
      computeType: 'BUILD_GENERAL1_SMALL',
    },
  });

  try {
    const response = await codebuild.send(command);
    console.log('Codebuild project created:', response.project);
    return response.project;
  } catch (error) {
    console.error('Error creating codebuild project:', error);
    throw error;
  }
}

export { createCodeBuildProject };
