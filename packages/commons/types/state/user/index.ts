import { Error } from '../../api/index';

export type UserState = {
  email: string;
  token: string;
  errors: Error[];
};
