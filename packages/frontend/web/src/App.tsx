import 'ui/styles.css';
import './App.css';
import client from 'api';
import NotificationCenter from 'ui/src/components/NotificationCenter';
import Login from './routes/login';
import Signup from './routes/signUp';
import Home from './routes/home';
import { Navigate, Outlet, RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { notificationState } from './state';
import SimpleLayout from './layouts/simpleLayout';
import FullLayout from './layouts/fullLayout';
import { useEffect, useState } from 'react';

client.configure(import.meta.env.VITE_API_URL);

function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function verifyToken() {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
      } else {
        try {
          const response = await client.auth.validateToken({ token });
          console.log('Validating token');
          if (response.success) setIsAuthenticated(response.data.isValid);
        } catch (error) {
          setIsAuthenticated(false);
        }
      }
    }

    verifyToken();
  }, []);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

const routes: RouteObject[] = [
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      { path: '/', element: <FullLayout>< Home /></FullLayout> }
    ]
  },
  {
    path: '/login',
    element: <SimpleLayout>< Login /></SimpleLayout>,
  },
  {
    path: '/signup',
    element: <SimpleLayout>< Signup /></SimpleLayout>,
  },
];

export default function App() {
  const router = createBrowserRouter(routes);

  return (
    <>
      <RouterProvider router={router} />
      <NotificationCenter notifications={notificationState((state) => state.notifications)} />
    </>
  );
}
