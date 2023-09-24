import {
  loginInputSchema,
  loginOutputSchema,
  signUpInputSchema,
  signUpOutputSchema,
  confirmUserInputSchema,
  confirmUserOutputSchema,
} from 'types';
import { request } from '../lib/request';
import { z } from 'zod';

const auth = {
  login: (data: z.infer<typeof loginInputSchema>) =>
    request(loginInputSchema, loginOutputSchema, {
      method: 'POST',
      url: '/login',
      data,
    }),
  signup: (data: z.infer<typeof signUpInputSchema>) =>
    request(signUpInputSchema, signUpOutputSchema, {
      method: 'POST',
      url: '/signup',
      data,
    }),
  confirmUser: (data: z.infer<typeof confirmUserInputSchema>) =>
    request(confirmUserInputSchema, confirmUserOutputSchema, {
      method: 'POST',
      url: '/confirm-user',
      data,
    }),
};

export default auth;
