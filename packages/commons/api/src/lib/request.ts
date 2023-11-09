import { AxiosRequestConfig } from 'axios';
import ApiClient from './client';
import { z } from 'zod';
import { Error } from 'types/api';

async function request<I, O>(
  inputSchema: z.ZodType<I>,
  outputSchema: z.ZodType<O>,
  options: AxiosRequestConfig,
): Promise<{ success: true; data: O } | { success: false; data: { errors: Error[] } }> {
  const validatedInput = inputSchema.safeParse(options.data);
  if (!validatedInput.success) {
    return {
      success: false,
      data: {
        errors: validatedInput.error.errors.map((error: any) => ({
          code: 'INVALID_INPUT',
          field: error.path[0],
          message: error.message,
        })),
      },
    };
  }

  try {
    const response = await ApiClient.request({
      ...options,
      data: validatedInput.data,
    });

    const validatedOutput = outputSchema.safeParse(response.data);
    if (!validatedOutput.success) {
      return {
        success: false,
        data: {
          errors: validatedOutput.error.errors.map((error: any) => ({
            code: 'INVALID_OUTPUT',
            field: error.path[0],
            message: error.message,
          })),
        },
      };
    }

    return {
      success: true,
      data: validatedOutput.data,
    };
  } catch (e: any) {
    return {
      success: false,
      data: { errors: e.response.data.errors },
    };
  }
}

export default request;
