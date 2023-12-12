import {
  CognitoIdentityProvider,
  ResendConfirmationCodeCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { resendConfirmationCodeInputSchema, resendConfirmationCodeOutputSchema } from 'types';
import { Lambda, codes } from 'src/lib/lambda';
import { z } from 'zod';

const cognito = new CognitoIdentityProvider();

const resendConfirmationCode = Lambda(
  resendConfirmationCodeInputSchema,
  resendConfirmationCodeOutputSchema,
  async (event: z.infer<typeof resendConfirmationCodeInputSchema>) => {
    try {
      await cognito.resendConfirmationCode({
        ClientId: process.env['COGNITO_USER_POOL_CLIENT_ID'],
        Username: event.email,
      });

      return {
        success: true,
        statusCode: codes.codeResent.statusCode,
        data: {
          email: event.email,
        },
      };
    } catch (error: any) {
      console.error(error);
      return {
        success: false,
        statusCode: codes.serverError.statusCode,
        data: {
          error: { code: codes.serverError.code, message: codes.serverError.message },
        },
      };
    }
  },
);

export default resendConfirmationCode;
