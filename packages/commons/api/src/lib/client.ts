import axios, { AxiosInstance } from 'axios';
import auth from '../auth/index';

class apiClient {
  private axiosInstance: AxiosInstance | null = null;
  public auth = auth;

  public configure(baseURL: string): void {
    if (!this.axiosInstance) {
      this.axiosInstance = axios.create({
        baseURL,
      });
    } else {
      throw new Error('apiClient already configured.');
    }
  }

  public getAxiosInstance(): AxiosInstance {
    if (!this.axiosInstance) {
      throw new Error('You have to configure the apiClient before use it.');
    }
    return this.axiosInstance;
  }
}

export default apiClient;
