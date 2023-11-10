export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export type Notification = {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
};
