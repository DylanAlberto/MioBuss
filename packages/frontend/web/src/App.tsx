import React from 'react';
import {
  RouterProvider,
  createBrowserRouter,
  RouterProps,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './state/store';
import Home from './routes/home';
import Login from './routes/login';
import './App.css';

const routes: RouterProps = [
  {
    path: '/',
    element: < Home />,
  },
  {
    path: '/login',
    element: < Login />,
  },
];

const router = createBrowserRouter(routes);

export default function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}
