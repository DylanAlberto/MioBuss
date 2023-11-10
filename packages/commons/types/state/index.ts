import { UserState } from './user';
import { Notification } from './notification';

export type State = {
  user: UserState;
  notifications: Notification[];
};
