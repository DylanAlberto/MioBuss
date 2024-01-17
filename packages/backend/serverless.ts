import type { AWS } from '@serverless/typescript';

import functions from './src/lambdas';

const serverlessConfiguration: AWS = {
  service: 'api',
  frameworkVersion: '3.38.0',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    stage: "${opt:stage, 'dev'}",
    region: 'us-west-2',
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      COGNITO_USER_POOL_ID: '${ssm:COGNITO_USER_POOL_ID}',
      COGNITO_USER_POOL_CLIENT_ID: '${ssm:COGNITO_USER_POOL_CLIENT_ID}',
      DB_NAME: '${ssm:DB_NAME}',
    },
    deploymentMethod: 'direct',
    architecture: 'arm64',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'cloudwatch:GetMetricData',
        Resource: '*',
      },
    ],
  },
  functions,
  package: { individually: true },
  useDotenv: true,
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    offline: {
      useChildProcesses: true,
    },
  },
};

module.exports = serverlessConfiguration;
