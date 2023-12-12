import { AxiosRequestConfig } from 'axios';
import ApiClient from './client';
import { z } from 'zod';
import { Error, codes } from 'types/api';

async function request<I, O>(
  inputSchema: z.ZodType<I>,
  outputSchema: z.ZodType<O>,
  options: AxiosRequestConfig,
): Promise<{ success: true; data: O } | { success: false; data: { error: Error } }> {
  const validatedInput = inputSchema.safeParse(options.data);
  if (!validatedInput.success) {
    return {
      success: false,
      data: {
        error: {
          code: codes.badRequest.code,
          fields: validatedInput.error.errors.map((error: any) => ({
            field: error.path[0],
            message: error.message,
          })),
          message: codes.badRequest.message,
        },
      },
    };
  }

  try {
    const response = await ApiClient.request({
      ...options,
      data: validatedInput.data,
    });

    const validatedOutput = outputSchema.safeParse(response.data.data);
    if (!validatedOutput.success) {
      return {
        success: false,
        data: {
          error: {
            code: codes.serverError.code,
            message: codes.serverError.message,
            fields: validatedOutput.error.errors.map((error: any) => ({
              code: codes.serverError.code,
              field: error.path[0],
              message: error.message,
            })),
          },
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
      data: e.response.data,
    };
  }
}

export default request;
