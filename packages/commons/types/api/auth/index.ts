import { z } from 'zod';

export const useAuth = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  lastName: z.string(),
  pictureUrl: z.string(),
  email: z.string().email(),
  token: z.string(),
  refreshToken: z.string(),
  type: z.enum(['company', 'person']),
});

export const signUpInputSchema = z.object({
  name: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  type: z.enum(['company', 'person']),
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
});

export const resendConfirmationCodeInputSchema = z.object({
  email: z.string(),
});

export const resendConfirmationCodeOutputSchema = z.object({
  email: z.string(),
});

export const validateTokenInputSchema = z.object({
  token: z.string(),
});

export const validateTokenOutputSchema = z.object({
  isValid: z.boolean(),
});
