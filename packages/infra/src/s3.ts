import {
  CreateBucketCommand,
  CreateBucketCommandInput,
  HeadBucketCommand,
  PutBucketPolicyCommand,
  PutBucketWebsiteCommand,
  PutPublicAccessBlockCommand,
  PutPublicAccessBlockCommandInput,
} from '@aws-sdk/client-s3';
import { s3 } from './awsSDK';

async function createBucket(bucketName: string, webAppHosted: boolean = false) {
  const bucketExists = await checkBucketExists(bucketName);
  const params: CreateBucketCommandInput = { Bucket: bucketName };

  if (bucketExists) {
    console.log(`* Bucket '${bucketName}' already exists`);
    return true;
  }

  try {
    await s3.send(new CreateBucketCommand(params));
    console.log(`* Bucket '${bucketName}' created`);
  } catch (error) {
    console.error('* Error creating bucket:', error);
    return false;
  }

  if (webAppHosted) {
    const publicAccessBlockParams: PutPublicAccessBlockCommandInput = {
      Bucket: bucketName,
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: false,
        BlockPublicPolicy: false,
        IgnorePublicAcls: false,
        RestrictPublicBuckets: false,
      },
    };
    try {
      await s3.send(new PutPublicAccessBlockCommand(publicAccessBlockParams));
      return true;
    } catch (error) {
      console.error('* Error configuring public access block:', error);
      return false;
    }
  }
}

async function checkBucketExists(bucketName: string): Promise<boolean> {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucketName }));
    return true;
  } catch (error: any) {
    if (error.name === 'NotFound' || error.name === 'Forbidden') {
      return false;
    }
    throw error;
  }
}

async function configureToHostWebApp(bucketName: string) {
  try {
    await s3.send(
      new PutBucketWebsiteCommand({
        Bucket: bucketName,
        WebsiteConfiguration: {
          IndexDocument: {
            Suffix: 'index.html',
          },
          ErrorDocument: {
            Key: 'error.html',
          },
        },
      }),
    );

    console.log(`* Bucket '${bucketName}' configured to host a static web app`);
    const publicReadPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${bucketName}/*`,
        },
      ],
    };
    await s3.send(
      new PutBucketPolicyCommand({
        Bucket: bucketName,
        Policy: JSON.stringify(publicReadPolicy),
      }),
    );
    console.log(`* Bucket '${bucketName}' configured to allow public read access`);
  } catch (error) {
    console.error('* Error configuring bucket to host web app:', error);
    return false;
  }
}

export { createBucket, configureToHostWebApp };
