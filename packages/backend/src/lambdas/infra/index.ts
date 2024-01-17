import type { AWS } from '@serverless/typescript';
const basePath = '/infra';

export const functions: AWS['functions'] = {
  dbMonitor: {
    handler: 'src/lambdas/infra/dbMonitor.default',
    description: 'Lambda function to monitor database',
    memorySize: 128,
    timeout: 10,
    events: [
      {
        schedule: 'cron(0,30 * * * ? *)',
      },
    ],
  },
};
