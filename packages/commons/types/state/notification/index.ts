export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export type Notification = {
  code: string;
  type: NotificationType;
  message: string;
  duration?: number;
};

export type NotificationsState = {
  notifications: Notification[];
};
