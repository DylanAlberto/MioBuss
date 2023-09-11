import type { AWS } from '@serverless/typescript';

import { loginSchema } from 'types/index';

export const functions: AWS['functions'] = {
  login: {
    handler: 'src/lambdas/auth/login/handler.main',
    description: 'Lambda function to login a user',
    memorySize: 128,
    events: [
      {
        http: {
          method: 'post',
          path: 'login',
          cors: true,
          request: {
            schemas: {
              'application/json': loginSchema,
            },
          },
        },
      },
    ],
  },
};
