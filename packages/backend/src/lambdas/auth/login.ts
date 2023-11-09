import {
  CognitoIdentityProvider,
  InitiateAuthRequest,
} from '@aws-sdk/client-cognito-identity-provider';
import { loginInputSchema, loginOutputSchema } from 'types';
import { Lambda, httpCodes } from 'src/lib/response';
import { z } from 'zod';

const cognito = new CognitoIdentityProvider();

const login = Lambda(
  loginInputSchema,
  loginOutputSchema,
  async (event: z.infer<typeof loginInputSchema>) => {
    const params: InitiateAuthRequest = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env['COGNITO_USER_POOL_CLIENT_ID'],
      AuthParameters: {
        USERNAME: event.email,
        PASSWORD: event.password,
      },
    };

    try {
      const response = await cognito.initiateAuth(params);

      if (response && response.AuthenticationResult) {
        const { AccessToken, RefreshToken } = response.AuthenticationResult;

        if (AccessToken && RefreshToken) {
          return {
            success: true,
            statusCode: 200,
            data: {
              email: event.email,
              accessToken: AccessToken,
              refreshToken: RefreshToken,
            },
          };
        }
      }
    } catch (error: any) {
      return {
        success: false,
        statusCode: ['NotAuthorizedException', 'UserNotFoundException'].includes(error.__type)
          ? httpCodes.unauthorized.statusCode
          : httpCodes.serverError.statusCode,
        data: {
          errors: [{ code: httpCodes.unauthorized.code, message: httpCodes.unauthorized.message }],
        },
      };
    }
  },
);

export default login;
