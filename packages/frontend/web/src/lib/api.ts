import axiosClient from './axiosClient';

const api = {
  auth: {
    login: async (data: FromSchema<typeof loginSchema>) => axiosClient.post('login', data),
  },
};

export default api;
