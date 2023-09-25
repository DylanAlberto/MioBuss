import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { InitiateAuthRequest } from '@aws-sdk/client-cognito-identity-provider';
import { loginInputSchema, loginOutputSchema } from 'types';
import { Lambda } from 'src/lib/response';
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

    const response = await cognito.initiateAuth(params);

    if (response && response.AuthenticationResult) {
      const { AccessToken, RefreshToken } = response.AuthenticationResult;

      if (AccessToken && RefreshToken) {
        return {
          email: event.email,
          accessToken: AccessToken,
          refreshToken: RefreshToken,
        };
      }
    }
  },
);

export default login;
