import { CognitoIdentityProvider, SignUpRequest } from '@aws-sdk/client-cognito-identity-provider';
import { signUpInputSchema, signUpOutputSchema } from 'types';
import { Lambda, codes } from 'src/lib/lambda';
import { z } from 'zod';

const cognito = new CognitoIdentityProvider();

const createAccount = Lambda(
  signUpInputSchema,
  signUpOutputSchema,
  async (event: z.infer<typeof signUpInputSchema>) => {
    const params: SignUpRequest = {
      ClientId: process.env['COGNITO_USER_POOL_CLIENT_ID'],
      Username: event.email,
      Password: event.password,
      UserAttributes: [
        {
          Name: 'email',
          Value: event.email,
        },
      ],
    };

    try {
      await cognito.signUp(params);
      return {
        success: true,
        statusCode: codes.ok.statusCode,
        data: { email: event.email },
      };
    } catch (error: any) {
      return {
        success: false,
        statusCode: codes.serverError.statusCode,
        data: {
          error: {
            code: codes.serverError.code,
            message: codes.serverError.message,
          },
        },
      };
    }
  },
);

export default createAccount;
