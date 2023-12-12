import React, { useEffect, useState } from 'react';
import type { Notification } from 'types';
import { FiInfo } from "react-icons/fi";
import { FaRegCircleCheck } from "react-icons/fa6";
import { RiErrorWarningLine } from "react-icons/ri";
import { VscError } from "react-icons/vsc";

interface NotificationProps extends Notification {
  borderColor?: string;
}

const NotificationComponent: React.FC<NotificationProps> = ({ type, message, duration = 3000, borderColor }) => {
  const [isVisible, setIsVisible] = useState(true);
  const notificationProperties = {
    info: {
      icon: <FiInfo />,
      style: 'bg-blue-500',
      defaultBorderColor: 'border-blue-900',
    },
    success: {
      icon: <FaRegCircleCheck />,
      style: 'bg-green-500',
      defaultBorderColor: 'border-green-900',
    },
    warning: {
      icon: <RiErrorWarningLine />,
      style: 'bg-yellow-500',
      defaultBorderColor: 'border-yellow-900',
    },
    error: {
      icon: <VscError />,
      style: 'bg-red-500',
      defaultBorderColor: 'border-red-900',
    },
  };
  const borderClass = borderColor ? `border-[${borderColor}]` : notificationProperties[type].defaultBorderColor;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration - 300);

    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div className={borderClass}>
      <div className={`flex flex-row items-center fixed top-0 left-1/2 transform -translate-x-1/2 p-4 border-4 rounded-md ${notificationProperties[type].style} text-white transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'}`} style={{ animation: `borderTrace 2s linear infinite` }}>
        <div className="mr-4 z-10">
          {notificationProperties[type].icon}
        </div>
        <div className="z-10">
          {message}
        </div>
      </div >
    </div>
  );
};

export default NotificationComponent;
