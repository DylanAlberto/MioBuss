import { create } from 'zustand';
import { NotificationsState, Notification } from 'types';

const initialState: NotificationsState = {
  notifications: [],
};

type NotificationMutations = {
  addNotification: (notification: Notification) => void;
  clearNotifications: () => void;
};

const notificationState = create<typeof initialState & NotificationMutations>((set) => ({
  ...initialState,
  addNotification: (notification: Notification) =>
    set((state) => ({ ...state, notifications: [...state.notifications, notification] })),
  clearNotifications: () => set(() => initialState),
}));

export default notificationState;
