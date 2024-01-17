import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { SSM } from '@aws-sdk/client-ssm';
import { CodePipelineClient } from '@aws-sdk/client-codepipeline';
import { IAMClient } from '@aws-sdk/client-iam';
import { CodeStarConnectionsClient } from '@aws-sdk/client-codestar-connections';
import { S3Client } from '@aws-sdk/client-s3';
import { CodeBuildClient } from '@aws-sdk/client-codebuild';
import { RDSClient } from '@aws-sdk/client-rds';

import dotenv from 'dotenv';

dotenv.config({ path: `./.env.${process.env.NODE_ENV || 'dev'}` });

console.log('AWS_REGION: ', process.env.AWS_REGION);

const cognito = new CognitoIdentityProvider({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const ssm = new SSM({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const codepipeline = new CodePipelineClient({ region: process.env.AWS_REGION });
const iam = new IAMClient({ region: process.env.AWS_REGION });
const codestar = new CodeStarConnectionsClient({ region: process.env.AWS_REGION });
const s3 = new S3Client({ region: process.env.AWS_REGION });
const codebuild = new CodeBuildClient({ region: process.env.AWS_REGION });
const rds = new RDSClient({ region: process.env.AWS_REGION });

export { cognito, ssm, codepipeline, iam, codestar, s3, codebuild, rds };
