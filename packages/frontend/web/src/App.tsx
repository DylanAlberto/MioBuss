import {
  RouterProvider,
  createBrowserRouter,
  RouteObject,
  Outlet,
  Navigate,
} from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './state/store';
import Home from './routes/home';
import Login from './routes/login';
import Signup from './routes/signUp';
import './App.css';
import client from 'api';
import { UserState } from 'types/state/user/index';
import { State } from 'types';
import { addNotification, removeNotification } from './state/slices/notification';
import { Notification } from 'types/state/notification';
import NotificationCenter from 'ui/src/components/NotificationCenter';

client.configure(import.meta.env.VITE_API_URL);

function ProtectedRoute() {
  const token = useSelector((state: UserState) => state.token);
  return token ? <Outlet /> : <Navigate to="/login" />;
}

const routes: RouteObject[] = [
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      { path: '/', element: <Home /> }
    ]
  },
  {
    path: '/login',
    element: < Login />,
  },
  {
    path: '/signup',
    element: < Signup />,
  },
];

const router = createBrowserRouter(routes);

export default function App() {
  const notifications = useSelector((state: State) => state.notifications);
  const dispatch = useDispatch();

  const onDismiss = ({ id }: Notification) => {
    dispatch(removeNotification(id));
  };

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <NotificationCenter notifications={notifications} onDismiss={onDismiss} />
    </Provider>
  );
}
