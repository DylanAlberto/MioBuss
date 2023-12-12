import { APIGatewayProxyHandler } from 'aws-lambda';
import { ZodType } from 'zod';
import { Error, codes } from 'types/api';

function Lambda<I, O>(
  inputSchema: ZodType<I>,
  outputSchema: ZodType<O>,
  handlerFunction: (
    data: I,
  ) => Promise<
    | { success: true; statusCode: number; data: O }
    | { success: false; statusCode: number; data: { error: Error } }
    | undefined
  >,
): APIGatewayProxyHandler {
  return async (event) => {
    const inputData = JSON.parse(event.body || '{}');
    const parsedInput = inputSchema.safeParse(inputData);

    if (!parsedInput.success) {
      return {
        statusCode: codes.badRequest.statusCode,
        body: JSON.stringify({
          success: false,
          error: {
            code: codes.badRequest.code,
            message: codes.badRequest.message,
            fields: [
              ...parsedInput.error.errors.map((error: any) => ({
                field: error.path[0],
                message: error.message,
              })),
            ],
          },
        }),
      };
    }

    const response = await handlerFunction(parsedInput.data);

    if (!response) {
      return {
        statusCode: codes.serverError.statusCode,
        body: JSON.stringify({
          success: false,
          error: { message: codes.serverError.message, code: codes.serverError.code },
        }),
      };
    }

    if (!response.success) {
      return {
        statusCode: response.statusCode,
        body: JSON.stringify({
          success: false,
          error: response.data.error,
        }),
      };
    }

    const parsedOutput = outputSchema.safeParse(response.data);

    if (!parsedOutput.success) {
      return {
        statusCode: codes.serverError.statusCode,
        body: JSON.stringify({ success: false, message: 'Unexpected output format' }),
      };
    }

    return {
      statusCode: response.statusCode,
      body: JSON.stringify({ success: true, data: parsedOutput.data }),
    };
  };
}

export { Lambda, codes };
