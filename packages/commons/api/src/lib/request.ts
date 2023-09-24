import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { z, ZodType } from 'zod';
import apiClient from './client';

export async function request<T, U>(
  inputSchema: ZodType<T>,
  outputSchema: ZodType<U>,
  config: AxiosRequestConfig<z.infer<ZodType<T>>>,
): Promise<AxiosResponse<U>> {
  const axiosInstance = new apiClient().getAxiosInstance();

  try {
    const validInput = inputSchema.parse(config.data);
    const response: AxiosResponse<U> = await axiosInstance.request({
      ...config,
      data: validInput,
    });

    response.data = outputSchema.parse(response.data);

    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error en la petición');
  }
}
