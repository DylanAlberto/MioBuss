import {
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './state/store';
import Home from './pages/home';
import LoginForm from './pages/login';

import './App.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginForm />,
  },
  {
    path: '/home',
    element: <Home />,
  },
]);

export default function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}
