import React from 'react';
import NotificationComponent from '../CustomNotification';
import type { Notification } from 'types';

interface NotificationCenterProps {
  notifications: Notification[];
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications }) => {
  return (
    <div className="fixed top-0 right-0 p-6 space-y-2 z-50">
      {notifications.map((notification) => (
        <NotificationComponent
          code={notification.code}
          key={notification.message}
          type={notification.type}
          message={notification.message}
          duration={notification.duration}
        />
      ))}
    </div>
  );
};

export default NotificationCenter;
