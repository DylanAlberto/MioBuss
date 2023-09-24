import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/user';
import apiClientReducer from './slices/apiClient';

const store = configureStore({
  reducer: {
    users: usersReducer,
    apiClient: apiClientReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
