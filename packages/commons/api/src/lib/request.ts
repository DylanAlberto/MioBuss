import { AxiosRequestConfig } from 'axios';
import ApiClient from './client';
import { z } from 'zod';

async function request<I, O>(
  inputSchema: z.ZodType<I>,
  outputSchema: z.ZodType<O>,
  options: AxiosRequestConfig,
): Promise<{ success: boolean; data?: O; errors?: any }> {
  const validatedInput = inputSchema.safeParse(options.data);
  if (!validatedInput.success) {
    return {
      success: false,
      errors: validatedInput.error.errors.map((error: any) => ({
        field: error.path[0],
        message: error.message,
      })),
    };
  }

  const response = await ApiClient.request({
    ...options,
    data: validatedInput.data,
  });

  if (!response.success) {
    return response;
  }

  const validatedOutput = outputSchema.safeParse(response.data);
  if (!validatedOutput.success) {
    return {
      success: false,
      errors: validatedOutput.error.errors,
    };
  }

  return {
    success: true,
    data: validatedOutput.data,
  };
}

export default request;
