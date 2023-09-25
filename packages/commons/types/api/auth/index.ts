import { z } from 'zod';

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginOutputSchema = z.object({
  email: z.string().email(),
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const signUpInputSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .refine((value) => /[A-Z]/.test(value), {
      message: 'Password must contain at least one uppercase letter',
    }),
});

export const signUpOutputSchema = z.object({
  email: z.string().email(),
});

export const confirmUserInputSchema = z.object({
  email: z.string(),
  confirmationCode: z.string(),
});

export const confirmUserOutputSchema = z.object({
  email: z.string(),
  confirmed: z.boolean(),
});
