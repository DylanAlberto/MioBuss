import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { ConfirmSignUpRequest } from '@aws-sdk/client-cognito-identity-provider';
import { Lambda, codes } from 'src/lib/lambda';
import { confirmUserOutputSchema, confirmUserInputSchema } from 'types';
import { z } from 'zod';

const cognito = new CognitoIdentityProvider();

const confirmUser = Lambda(
  confirmUserInputSchema,
  confirmUserOutputSchema,
  async (event: z.infer<typeof confirmUserInputSchema>) => {
    const params: ConfirmSignUpRequest = {
      ClientId: process.env['COGNITO_USER_POOL_CLIENT_ID'],
      Username: event.email,
      ConfirmationCode: event.confirmationCode,
    };

    try {
      await cognito.confirmSignUp(params);
      return {
        success: true,
        statusCode: codes.ok.statusCode,
        data: {
          email: event.email,
        },
      };
    } catch (error: any) {
      console.error('Error confirming user:', error);
      return {
        success: false,
        statusCode: codes.serverError.statusCode,
        data: {
          code: codes.serverError.code,
          error: error.message,
        },
      };
    }
  },
);

export default confirmUser;
