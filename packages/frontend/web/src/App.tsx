import {
  RouterProvider,
  createBrowserRouter,
  RouteObject,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './state/store';
import Home from './routes/home';
import Login from './routes/login';
import './App.css';
import api from 'api';

const routes: RouteObject[] = [
  {
    path: '/',
    element: < Home />,
  },
  {
    path: '/login',
    element: < Login />,
  },
];

const apiClient = new api();
apiClient.configure(import.meta.env.VITE_API_URL);

const router = createBrowserRouter(routes);

export default function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}
