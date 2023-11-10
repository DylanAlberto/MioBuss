import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/user';
import notificationsReducer from './slices/notification';

const store = configureStore({
  reducer: {
    user: usersReducer,
    notifications: notificationsReducer,
  },
});

export default store;
