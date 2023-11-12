import { CreateBucketCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import { s3 } from './awsSDK';

async function createBucket(bucketName: string) {
  const bucketExists = await checkBucketExists(bucketName);

  if (bucketExists) {
    console.log(`* Bucket '${bucketName}' already exists`);
    return true;
  }

  try {
    await s3.send(new CreateBucketCommand({ Bucket: bucketName }));
    console.log(`* Bucket '${bucketName}' created`);
    return true;
  } catch (error) {
    console.error('* Error creating bucket:', error);
    return false;
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

export { createBucket };
