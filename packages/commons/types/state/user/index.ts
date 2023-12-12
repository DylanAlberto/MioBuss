import { Error } from '../../api/index';

export type UserState = {
  email: string;
  token: string;
  refreshToken: string;
  errors: { [key: string]: Error };
};
