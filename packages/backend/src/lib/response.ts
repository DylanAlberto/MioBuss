import { APIGatewayProxyHandler } from 'aws-lambda';
import { ZodType } from 'zod';

export function Lambda<I, O>(
  inputSchema: ZodType<I>,
  outputSchema: ZodType<O>,
  handlerFunction: (eventData: I) => Promise<O>,
): APIGatewayProxyHandler {
  return async (event) => {
    const inputData = JSON.parse(event.body || '{}');
    console.log('ANTES');
    const parsedInput = inputSchema.safeParse(inputData);
    console.log('DESPUES');
    let response = null;

    if (!parsedInput.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          errors: parsedInput.error.errors.map((error: any) => ({
            field: error.path[0],
            message: error.message,
          })),
        }),
      };
    }
    try {
      response = await handlerFunction(parsedInput.data);
    } catch (error: any) {
      console.error(error);
      return {
        statusCode: error.$metadata.httpStatusCode || 500,
        body: JSON.stringify({
          success: false,
          errors: typeof error === 'object' ? [error] : error,
        }),
      };
    }
    const parsedOutput = outputSchema.safeParse(response);

    if (!parsedOutput.success) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Unexpected output format' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(parsedOutput.data),
    };
  };
}
