import {
  CreateConnectionCommand,
  GetConnectionCommand,
  ListConnectionsCommand,
} from '@aws-sdk/client-codestar-connections';
import { codestar } from './awsSDK';

async function getOrCreateCodeStarConnection(connectionName: string) {
  const listConnectionsCommand = new ListConnectionsCommand({});
  const existingConnections = await codestar.send(listConnectionsCommand);

  const existingConnection = existingConnections.Connections?.find(
    (connection) => connection.ConnectionName === connectionName,
  );

  if (existingConnection) {
    console.log('* Codestar connection already exists.');
    return existingConnection.ConnectionArn;
  }

  const createConnectionCommand = new CreateConnectionCommand({
    ProviderType: 'GitHub',
    ConnectionName: connectionName,
  });

  try {
    const response = await codestar.send(createConnectionCommand);
    console.log(
      '* Please go to the AWS console -> Developer tools -> Connections and confirm the connection',
    );

    await waitForConnectionConfirmation(response.ConnectionArn as string);

    return response.ConnectionArn;
  } catch (error) {
    console.error('* Error creating connection:', error);
    throw error;
  }
}

async function waitForConnectionConfirmation(connectionArn: string) {
  let isConnected = false;

  while (!isConnected) {
    try {
      const response = await codestar.send(
        new GetConnectionCommand({ ConnectionArn: connectionArn }),
      );
      if (response.Connection && response.Connection.ConnectionStatus === 'AVAILABLE') {
        isConnected = true;
        console.log('* Connection available!');
      } else {
        console.log('* Waiting for connection to be available...');
        await new Promise((resolve) => setTimeout(resolve, 30000));
      }
    } catch (error) {
      console.error('* Error verifyin connection', error);
      throw error;
    }
  }

  return connectionArn;
}

export { getOrCreateCodeStarConnection };
