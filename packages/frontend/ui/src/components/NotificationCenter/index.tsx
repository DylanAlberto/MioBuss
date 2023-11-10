import React from 'react';
import NotificationComponent from '../CustomNotification'; // Asume que tienes un componente Notification en tu librería
import type { Notification as NotificationType } from 'types/state/notification';

interface NotificationCenterProps {
  notifications: NotificationType[];
  onDismiss: ({ id }: NotificationType) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications, onDismiss }) => {
  return (
    <div className="fixed top-0 right-0 p-6 space-y-2 z-50">
      {notifications.map((notification) => (
        <NotificationComponent
          key={notification.id}
          id={notification.id}
          type={notification.type}
          message={notification.message}
          duration={notification.duration}
          onDismiss={() => onDismiss(notification)}
        />
      ))}
    </div>
  );
};

export default NotificationCenter;
