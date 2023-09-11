import { loginSchema } from 'types';
import axiosClient from './axiosClient';
import { FromSchema } from 'json-schema-to-ts';

const api = {
  auth: {
    login: async (data: FromSchema<typeof loginSchema>) => axiosClient.post('login', data),
  },
};

export default api;
