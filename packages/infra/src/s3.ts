import {
  CreateBucketCommand,
  CreateBucketCommandInput,
  DeleteBucketCommand,
  DeleteObjectsCommand,
  HeadBucketCommand,
  ListObjectsV2Command,
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

  return true;
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

async function deleteBucket(bucketName: string) {
  try {
    const bucketExists = await checkBucketExists(bucketName);
    if (!bucketExists) {
      console.log(`* Bucket '${bucketName}' does not exist`);
      return;
    }
    console.log(`* Bucket '${bucketName}' exist, listing objects...`);
    const listedObjects = await s3.send(new ListObjectsV2Command({ Bucket: bucketName }));

    if (listedObjects.Contents && listedObjects.Contents?.length > 0) {
      console.log(`* Bucket '${bucketName}' is not empty, deleting contents...`);
      await s3.send(
        new DeleteObjectsCommand({
          Bucket: bucketName,
          Delete: { Objects: listedObjects.Contents?.map(({ Key }) => ({ Key })) },
        }),
      );

      if (listedObjects.IsTruncated) await deleteBucket(bucketName);
    }

    await s3.send(new DeleteBucketCommand({ Bucket: bucketName }));
    console.log(`* Bucket '${bucketName}' deleted`);
  } catch (error) {
    console.error('* Error deleting bucket:', error);
    throw error;
  }
}

export { createBucket, configureToHostWebApp, deleteBucket };
