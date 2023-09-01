import cognito from './awsSDK';

async function createUserPoolAndObtainId(poolName: string): Promise<string> {
  try {
    const listPoolsResponse = await cognito.listUserPools({ MaxResults: 60 });
    const existingPool = listPoolsResponse.UserPools?.find((pool: any) => pool.Name === poolName);

    if (existingPool) {
      return existingPool.Id!;
    }

    const createPoolResponse = await cognito.createUserPool({
      PoolName: poolName,
    });
    return createPoolResponse.UserPool!.Id!;
  } catch (error) {
    console.error('Error creating or retrieving User Pool:', error);
    throw error;
  }
}

export { createUserPoolAndObtainId };
