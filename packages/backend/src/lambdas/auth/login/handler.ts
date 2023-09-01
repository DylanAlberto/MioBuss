import type { APIGatewayProxyResult } from 'aws-lambda';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import type { ValidatedAPIGatewayProxyEvent } from '../../../lib/response';
import { formatJSONResponse } from '../../../lib/response';
import { middyfy } from '../../../lib/middify';

import schema from './schema';
import { InitiateAuthRequest } from 'aws-sdk/clients/cognitoidentityserviceprovider';

const cognito = new CognitoIdentityServiceProvider();

const Handler = async (
  event: ValidatedAPIGatewayProxyEvent<typeof schema>,
): Promise<APIGatewayProxyResult> => {
  const body = JSON.parse(event.body);

  const params: InitiateAuthRequest = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: process.env.COGNITO_CLIENT_ID || '',
    AuthParameters: {
      USERNAME: body.username,
      PASSWORD: body.password,
    },
  };

  try {
    const data = await cognito.initiateAuth(params).promise();
    return formatJSONResponse({
      statusCode: 200,
      message: 'Logged in successfully',
      data,
    });
  } catch (error: any) {
    return formatJSONResponse({
      statusCode: 400,
      message: error.message,
    });
  }
};

export const main = middyfy(Handler);
