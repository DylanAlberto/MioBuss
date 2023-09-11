import type { APIGatewayProxyResult } from 'aws-lambda';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { InitiateAuthRequest } from '@aws-sdk/client-cognito-identity-provider';
import type { ValidatedAPIGatewayProxyEvent } from '../../../lib/response';
import { formatJSONResponse } from '../../../lib/response';
import { middyfy } from '../../../lib/middify';
import { loginSchema } from 'types/index';

const cognito = new CognitoIdentityProvider();

const Handler = async (
  event: ValidatedAPIGatewayProxyEvent<typeof loginSchema>,
): Promise<APIGatewayProxyResult> => {
  const body = event.body;
  const params: InitiateAuthRequest = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: process.env['COGNITO_USER_POOL_ID'],
    AuthParameters: {
      USERNAME: body.username,
      PASSWORD: body.password,
    },
  };

  try {
    const data = await cognito.initiateAuth(params);
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
