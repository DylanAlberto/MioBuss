import React, { ReactNode, useEffect } from 'react';
import { userState } from '../state';
import { useLocation } from 'react-router-dom';

interface SimpleLayoutProps {
  children: ReactNode;
}

const SimpleLayout: React.FC<SimpleLayoutProps> = ({ children }) => {
  const { clearErrors } = userState();
  const location = useLocation();

  useEffect(() => {
    clearErrors();
  }, [location]);
  return (
    <div className='flex justify-center items-center h-full'>
      {children}
    </div>
  );
};

export default SimpleLayout;
