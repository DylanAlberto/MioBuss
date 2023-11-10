import React, { useEffect } from 'react';
import type { Notification as NotificationType } from 'types/state/notification';

interface NotificationProps extends NotificationType {
  onDismiss: () => void;
}

const NotificationComponent: React.FC<NotificationProps> = ({ id, type, message, duration, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  const typeStyles = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  return (
    <div className={`fixed top-0 left-1/2 transform -translate-x-1/2 p-4 ${typeStyles[type]} text-white`}>
      {message}
    </div>
  );
};

export default NotificationComponent;
