import type { AWS } from '@serverless/typescript';

import functions from './src/lambdas';

const serverlessConfiguration: AWS = {
  service: 'api1',
  frameworkVersion: '3.28.1',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    stage: 'dev',
    region: 'eu-central-1',
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      COGNITO_CLIENT_ID: '${ssm:/api1/dev/cognito-client-id}',
    },
    deploymentMethod: 'direct',
    architecture: 'arm64',
  },
  functions,
  package: { individually: true },
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
  },
};

export default serverlessConfiguration;
