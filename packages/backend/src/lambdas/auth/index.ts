import type { AWS } from '@serverless/typescript';
const basePath = '/auth';

export const functions: AWS['functions'] = {
  login: {
    handler: 'src/lambdas/auth/login.default',
    description: 'Lambda function to login user',
    memorySize: 128,
    events: [
      {
        http: {
          method: 'post',
          path: `${basePath}/login`,
          cors: true,
        },
      },
    ],
  },
  signUp: {
    handler: 'src/lambdas/auth/signUp.default',
    description: 'Lambda function to create user',
    memorySize: 128,
    events: [
      {
        http: {
          method: 'post',
          path: `${basePath}/sign-up`,
          cors: true,
        },
      },
    ],
  },
  confirmUser: {
    handler: 'src/lambdas/auth/confirmUser.default',
    description: 'Lambda function to confirm user account',
    memorySize: 128,
    events: [
      {
        http: {
          method: 'post',
          path: `${basePath}/confirm-user`,
          cors: true,
        },
      },
    ],
  },
};
