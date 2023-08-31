import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/user';

export default configureStore({
  reducer: {
    users: usersReducer,
  },
});
