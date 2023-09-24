import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { ConfirmSignUpRequest } from '@aws-sdk/client-cognito-identity-provider';
import { Lambda } from 'src/lib/response';
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
        email: event.email,
        confirmed: true,
      };
    } catch (error) {
      console.error('Error confirming user:', error);
      throw new Error('Failed to confirm user');
    }
  },
);

export default confirmUser;
