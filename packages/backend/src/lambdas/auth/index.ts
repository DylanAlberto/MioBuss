import type { AWS } from '@serverless/typescript';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { loginInput, signUpInput, confirmUserInput } from 'types/api/auth';

export const functions: AWS['functions'] = {
  login: {
    handler: 'src/lambdas/auth/login.default',
    description: 'Lambda function to login user',
    memorySize: 128,
    events: [
      {
        http: {
          method: 'post',
          path: 'login',
          cors: true,
          request: {
            schemas: {
              'application/json': zodToJsonSchema(loginInput),
            },
          },
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
          path: 'sign-up',
          cors: true,
          request: {
            schemas: {
              'application/json': zodToJsonSchema(signUpInput),
            },
          },
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
          path: 'confirm-user',
          cors: true,
          request: {
            schemas: {
              'application/json': zodToJsonSchema(confirmUserInput),
            },
          },
        },
      },
    ],
  },
};
