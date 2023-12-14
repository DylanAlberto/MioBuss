import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import auth from '../auth';
class ApiClient {
  private static _instance: AxiosInstance | null = null;
  private constructor() {}

  public static configure(baseURL: string, handleAuth: () => void): void {
    if (!this._instance) {
      this._instance = axios.create({
        baseURL,
      });
    } else {
      throw new Error('apiClient already configured.');
    }
  }

  public static get instance(): AxiosInstance {
    if (!this._instance) {
      throw new Error('You have to configure the apiClient before use it.');
    }
    return this._instance;
  }

  public static async request(config: AxiosRequestConfig): Promise<any> {
    if (!this._instance) {
      throw new Error('You have to configure the apiClient before use it.');
    }
    return this._instance(config);
  }

  public static auth = auth;
}

export default ApiClient;
