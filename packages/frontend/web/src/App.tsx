import 'ui/styles.css';
import './App.css';
import client from 'api';
import NotificationCenter from 'ui/src/components/NotificationCenter';
import Login from './routes/login';
import Signup from './routes/signUp';
import Home from './routes/home';
import { RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { notificationState, userState } from './state';
import Layout from './layouts/layout';
import { useEffect } from 'react';

client.configure(import.meta.env.VITE_API_URL, () => { sessionStorage.removeItem('token') });

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout>< Home /></Layout>,
  },
  {
    path: '/login',
    element: <Layout protectedRoute={false} layoutType='simple'>< Login /></Layout>,
  },
  {
    path: '/signup',
    element: <Layout protectedRoute={false} layoutType='simple'>< Signup /></Layout>,
  },
];

export default function App() {
  const router = createBrowserRouter(routes);
  const { initializeTokenCheck } = userState();

  useEffect(() => {
    initializeTokenCheck();
  }, [initializeTokenCheck]);

  return (
    <>
      <RouterProvider router={router} />
      <NotificationCenter notifications={notificationState((state) => state.notifications)} />
    </>
  );
}
