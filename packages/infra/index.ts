import { getOrCreateAppClient, getOrCreateUserPool } from './src/cognito';
import { putParameter } from './src/parameterStore';
import dotenv from 'dotenv';

dotenv.config({ path: `./.env.${process.env.NODE_ENV || 'dev'}` });

const poolName = process.env.USER_POOL_NAME || 'test-user-pool';
const parameters: {
  name: string;
  value: string;
  type: 'String' | 'SecureString';
}[] = [];

(async () => {
  try {
    // Get or create the User Pool
    const userPoolId = await getOrCreateUserPool(poolName);
    console.log('User Pool ID:', userPoolId);

    // Get or create the App Client
    const appClientName = process.env.USER_POOL_CLIENT_NAME || 'mi-gym-client-dev';
    const appClientId = await getOrCreateAppClient(userPoolId, appClientName);
    console.log('App Client ID:', appClientId);

    parameters.push({ name: 'COGNITO_USER_POOL_ID', value: userPoolId, type: 'String' });
    parameters.push({ name: 'COGNITO_USER_POOL_CLIENT_ID', value: appClientId, type: 'String' });
    // Create the parameters in Parameter Store
    await Promise.all(
      parameters.map((param) => putParameter(param.name, param.value, param.type)) as any,
    );
  } catch (error) {
    console.error('Error:', error);
  }
})();
