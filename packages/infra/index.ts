import { createUserPoolAndObtainId } from './src/cognito';
import { putParameter } from './src/parameterStore';
import dotenv from 'dotenv';
dotenv.config({ path: `./.env.${process.env.NODE_ENV || 'dev'}` });

const poolName = process.env.USER_POOL_NAME || 'test-user-pool';
const parameters = [
  { name: 'test', value: 'AAA', type: 'String' },
  { name: 'test2', value: 'BBB', type: 'String' },
];

(async () => {
  try {
    const userPoolId = await createUserPoolAndObtainId(poolName);
    console.log('User Pool ID:', userPoolId);
    await Promise.all(
      parameters.map((param) => putParameter(param.name, param.value, param.type)) as any,
    );
  } catch (error) {
    console.error('Error:', error);
  }
})();
