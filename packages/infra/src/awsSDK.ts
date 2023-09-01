import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import dotenv from 'dotenv';

dotenv.config({ path: `./.env.${process.env.NODE_ENV || 'dev'}` });

console.log('AWS_REGION:');
console.log(process.env.AWS_REGION);

const cognito = new CognitoIdentityProvider({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export default cognito;
