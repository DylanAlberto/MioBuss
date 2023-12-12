import React, { ReactNode, useEffect } from 'react';
import { userState } from '../state';
import { useLocation } from 'react-router-dom';
import { NavBar } from 'ui';
import { SideMenu } from 'ui';

interface FullLayoutProps {
  children: ReactNode;
}

const FullLayout: React.FC<FullLayoutProps> = ({ children }) => {
  const { clearErrors } = userState();
  const location = useLocation();

  useEffect(() => {
    clearErrors();
  }, [location]);
  return (
    <div className='flex flex-col'>
      <NavBar />
      <div className='flex flex-row flex-grow w-full overflow-hidden min-h-screen'>
        <SideMenu />
        <div className='flex flex-col flex-grow'>{children}</div>
      </div>
    </div>
  );
};

export default FullLayout;
