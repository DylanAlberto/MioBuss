import {
  CognitoIdentityProvider,
  InitiateAuthRequest,
} from '@aws-sdk/client-cognito-identity-provider';
import { loginInputSchema, loginOutputSchema } from 'types';
import { Lambda, codes } from 'src/lib/lambda';
import { z } from 'zod';
import { AccessTokenModel } from 'src/lib/db/models';

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
        const { AccessToken, RefreshToken, ExpiresIn, IdToken } = response.AuthenticationResult;

        if (AccessToken && RefreshToken) {
          const newToken = new AccessTokenModel({
            id: IdToken,
            token: AccessToken,
            expiresAt: Math.floor(Date.now() / 1000) + (ExpiresIn || 3600),
          });

          await newToken.save();

          return {
            success: true,
            statusCode: codes.ok.statusCode,
            data: {
              email: event.email,
              accessToken: AccessToken,
              refreshToken: RefreshToken,
            },
          };
        }
      }
    } catch (error: any) {
      if (['NotAuthorizedException', 'UserNotFoundException'].includes(error.__type)) {
        return {
          success: false,
          statusCode: codes.invalidUserOrPassword.statusCode,
          data: {
            error: {
              code: codes.invalidUserOrPassword.code,
              message: codes.invalidUserOrPassword.message,
            },
          },
        };
      }
      if (error.__type === 'UserNotConfirmedException') {
        return {
          success: false,
          statusCode: codes.userNotConfirmed.statusCode,
          data: {
            error: {
              code: codes.userNotConfirmed.code,
              message: codes.userNotConfirmed.message,
            },
          },
        };
      }
      return {
        success: false,
        statusCode: codes.serverError.statusCode,
        data: {
          error: { code: codes.unauthorized.code, message: codes.unauthorized.message },
        },
      };
    }
  },
);

export default login;
