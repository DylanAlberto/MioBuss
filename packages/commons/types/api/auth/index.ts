import { z } from 'zod';

export const loginInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginOutputSchema = z.object({
  email: z.string().email(),
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const signUpInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const signUpOutputSchema = z.object({
  email: z.string().email(),
});

export const confirmUserInput = z.object({
  email: z.string(),
  confirmationCode: z.string(),
});

export const confirmUserOutputSchema = z.object({
  email: z.string(),
  confirmed: z.boolean(),
});
