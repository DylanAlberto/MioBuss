import { APIGatewayProxyHandler } from 'aws-lambda';
import { ZodType } from 'zod';
import { Error } from 'types/api';

const httpCodes: { [key: string]: { code: string; statusCode: number; message: string } } = {
  ok: {
    code: 'Ok',
    statusCode: 200,
    message: 'Ok',
  },
  badRequest: {
    code: 'BadRequest',
    statusCode: 400,
    message: 'Bad request',
  },
  unauthorized: {
    code: 'Unauthorized',
    statusCode: 401,
    message: 'Unauthorized',
  },
  serverError: {
    code: 'ServerError',
    statusCode: 500,
    message: 'Unexpected server error',
  },
};

function Lambda<I, O>(
  inputSchema: ZodType<I>,
  outputSchema: ZodType<O>,
  handlerFunction: (
    eventData: I,
  ) => Promise<
    | { success: true; statusCode: number; data: O }
    | { success: false; statusCode: number; data: { errors: Error[] } }
    | undefined
  >,
): APIGatewayProxyHandler {
  return async (event) => {
    const inputData = JSON.parse(event.body || '{}');
    const parsedInput = inputSchema.safeParse(inputData);

    if (!parsedInput.success) {
      return {
        statusCode: httpCodes.badRequest.statusCode,
        body: JSON.stringify({
          success: false,
          errors: parsedInput.error.errors.map((error: any) => ({
            field: error.path[0],
            message: error.message,
          })),
        }),
      };
    }

    const response = await handlerFunction(parsedInput.data);

    if (!response) {
      return {
        statusCode: httpCodes.serverError.statusCode,
        body: JSON.stringify({
          success: false,
          errors: [{ message: httpCodes.serverError.message }],
        }),
      };
    }
    if (!response?.success) {
      return {
        statusCode: response?.statusCode,
        body: JSON.stringify({
          success: false,
          errors: response?.data.errors,
        }),
      };
    }

    const parsedOutput = outputSchema.safeParse(response.data);

    if (!parsedOutput.success) {
      return {
        statusCode: httpCodes.serverError.statusCode,
        body: JSON.stringify({ success: false, message: 'Unexpected output format' }),
      };
    }

    return {
      statusCode: httpCodes.ok.statusCode,
      body: JSON.stringify({ success: true, data: parsedOutput.data }),
    };
  };
}

export { Lambda, httpCodes };
