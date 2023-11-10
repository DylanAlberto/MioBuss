import cognito from './awsSDK';

async function getOrCreateUserPool(poolName: string): Promise<string> {
  try {
    const listPoolsResponse = await cognito.listUserPools({ MaxResults: 60 });
    const existingPool = listPoolsResponse.UserPools?.find((pool: any) => pool.Name === poolName);

    if (existingPool) {
      return existingPool.Id!;
    }

    const createPoolResponse = await cognito.createUserPool({
      PoolName: poolName,
      AdminCreateUserConfig: {
        AllowAdminCreateUserOnly: false,
      },
      AutoVerifiedAttributes: ['email'],
      EmailConfiguration: {
        ReplyToEmailAddress: 'no-reply@mio-buss.com',
        EmailSendingAccount: 'COGNITO_DEFAULT',
      },
    });
    return createPoolResponse.UserPool!.Id!;
  } catch (error) {
    console.error('Error creating or retrieving User Pool:', error);
    throw error;
  }
}

async function getOrCreateAppClient(userPoolId: string, clientName: string): Promise<string> {
  const appClients = await cognito.listUserPoolClients({
    UserPoolId: userPoolId,
    MaxResults: 10,
  });

  const existingClient = appClients.UserPoolClients?.find(
    (client) => client.ClientName === clientName,
  );

  if (existingClient) {
    return existingClient.ClientId!;
  } else {
    const newAppClient = await cognito.createUserPoolClient({
      UserPoolId: userPoolId,
      ClientName: clientName,
      ExplicitAuthFlows: ['ALLOW_REFRESH_TOKEN_AUTH', 'ALLOW_USER_PASSWORD_AUTH'],
    });

    return newAppClient.UserPoolClient!.ClientId!;
  }
}

export { getOrCreateUserPool, getOrCreateAppClient };
