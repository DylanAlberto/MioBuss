import { Error } from '../../api/index';
import { loginOutputSchema } from '../../api/auth';
import { z } from 'zod';

export enum UserType {
  COMPANY = 'company',
  PERSON = 'person',
}

export type User = z.infer<typeof loginOutputSchema>;

export type UserState = User & {
  errors: { [key: string]: Error };
};
