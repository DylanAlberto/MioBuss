import React, { ReactNode, useEffect } from 'react';
import { userState } from '../state';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavBar } from 'ui';
import { SideMenu } from 'ui';

interface LayoutProps {
  children?: ReactNode;
  layoutType?: 'full' | 'simple';
  protectedRoute?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, layoutType = 'full', protectedRoute = true }) => {
  const { clearErrors } = userState();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (protectedRoute && !sessionStorage.getItem('token')) {
      navigate('/login');
    }
    clearErrors();
  }, [location]);

  if (layoutType === 'full') {
    return (
      <div className='flex flex-col'>
        <NavBar />
        <div className='flex flex-row flex-grow w-full overflow-hidden min-h-screen'>
          <SideMenu />
          <div className='flex flex-col flex-grow'>{children}</div>
        </div>
      </div>
    );
  } else {
    return (
      <div className='flex justify-center items-center h-full'>
        {children}
      </div>
    );
  }
};

export default Layout;
