import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from 'types/state/notification';

const initialState: Notification[] = [];

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: {
      reducer(state, action: PayloadAction<Notification>) {
        state.push(action.payload);
      },
      prepare({ id = nanoid(), type, message, duration = 3000 }: Notification): {
        payload: Notification;
      } {
        return {
          payload: {
            id: nanoid(),
            type,
            message,
            duration,
          },
        };
      },
    },
    removeNotification(state, action: PayloadAction<string>) {
      return state.filter((notification) => notification.id !== action.payload);
    },
  },
});

export const { addNotification, removeNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
