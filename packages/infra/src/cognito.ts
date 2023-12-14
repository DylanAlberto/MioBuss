import {
  DeleteUserPoolClientCommand,
  DeleteUserPoolCommand,
  ListUserPoolsCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';
import { cognito } from './awsSDK';

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
    console.error('* Error creating or retrieving User Pool:', error);
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

async function deleteCognitoResources(userPoolName: string) {
  const userPoolId: string | undefined = (
    await cognito.listUserPools({ MaxResults: 60 })
  ).UserPools?.find((pool) => pool.Name === userPoolName)?.Id;

  if (!userPoolId) {
    console.log('* User pool not found, skipping');
    return;
  }
  const appClients = await cognito.listUserPoolClients({
    UserPoolId: userPoolId,
    MaxResults: 10,
  });
  const existingClient = appClients.UserPoolClients?.find(
    (client) => client.UserPoolId === userPoolId,
  );

  if (!existingClient) {
    console.log('* User pool client not found, skipping');
    return;
  }

  await cognito.send(
    new DeleteUserPoolClientCommand({ UserPoolId: userPoolId, ClientId: existingClient.ClientId }),
  );
  await cognito.send(new DeleteUserPoolCommand({ UserPoolId: userPoolId }));
}

export { getOrCreateUserPool, getOrCreateAppClient, deleteCognitoResources };
