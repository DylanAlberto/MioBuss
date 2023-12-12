import { UserState } from './user';
import { NotificationsState } from './notification';

export type State = {
  user: UserState;
  notifications: NotificationsState;
};
