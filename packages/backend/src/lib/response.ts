import { APIGatewayProxyHandler } from 'aws-lambda';
import { ZodType } from 'zod';

export function Lambda<I, O>(
  inputSchema: ZodType<I>,
  outputSchema: ZodType<O>,
  handlerFunction: (eventData: I) => Promise<O>,
): APIGatewayProxyHandler {
  return async (event) => {
    const inputData = JSON.parse(event.body || '{}');
    const parsedInput = inputSchema.safeParse(inputData);
    let response = null;

    if (!parsedInput.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid input', errors: parsedInput.error.errors }),
      };
    }
    try {
      response = await handlerFunction(parsedInput.data);
    } catch (error: any) {
      console.error(error);
      return {
        statusCode: 500,
        body: JSON.stringify(error),
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
