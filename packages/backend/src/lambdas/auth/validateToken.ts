import { validateTokenInputSchema, validateTokenOutputSchema } from 'types';
import { Lambda, codes } from 'src/lib/lambda';
import { z } from 'zod';
import { AccessTokenModel } from 'src/lib/cache/models';

const login = Lambda(
  validateTokenInputSchema,
  validateTokenOutputSchema,
  async (event: z.infer<typeof validateTokenInputSchema>) => {
    try {
      const { token } = event;

      const accessToken = await AccessTokenModel.get({ token });

      if (!accessToken) {
        return {
          success: true,
          statusCode: codes.ok.statusCode,
          data: { isValid: false },
        };
      }

      return {
        success: true,
        statusCode: codes.ok.statusCode,
        data: { isValid: true },
      };
    } catch (error: any) {
      console.log(error);

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
