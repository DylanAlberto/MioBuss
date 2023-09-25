import {
  loginInputSchema,
  loginOutputSchema,
  signUpInputSchema,
  signUpOutputSchema,
  confirmUserInputSchema,
  confirmUserOutputSchema,
} from 'types';
import { z } from 'zod';
import request from '../lib/request';

const auth = {
  login: async (data: z.infer<typeof loginInputSchema>) =>
    request(loginInputSchema, loginOutputSchema, {
      method: 'POST',
      url: '/auth/login',
      data,
    }),
  signup: async (data: z.infer<typeof signUpInputSchema>) =>
    request(signUpInputSchema, signUpOutputSchema, {
      method: 'POST',
      url: '/auth/sign-up',
      data,
    }),
  confirmUser: async (data: z.infer<typeof confirmUserInputSchema>) =>
    request(confirmUserInputSchema, confirmUserOutputSchema, {
      method: 'POST',
      url: '/auth/confirm-user',
      data,
    }),
};

export default auth;
