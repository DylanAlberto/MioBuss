import { SSM } from '@aws-sdk/client-ssm';
import dotenv from 'dotenv';

dotenv.config({ path: `./.env.${process.env.NODE_ENV || 'dev'}` });

const ssm = new SSM({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

async function putParameter(name: string, value: string, type: string = 'String'): Promise<void> {
  try {
    await ssm.putParameter({
      Name: name,
      Value: value,
      Type: type,
      Overwrite: true,
    });
    console.log(`Parameter ${name} created successfully`);
  } catch (error) {
    console.error(`Error creating parameter ${name}:`, error);
    throw error;
  }
}

export { putParameter };
