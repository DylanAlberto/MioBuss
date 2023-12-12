import { UserState, Error } from 'types';
import { create } from 'zustand';

const initialState: UserState = {
  email: '',
  token: '',
  refreshToken: '',
  errors: {},
};

type UserMutations = {
  setUserState: (value: Partial<UserState>) => void;
  clearErrors: () => void;
  clearUser: () => void;
  addError: (error: Error) => void;
};

const userState = create<UserState & UserMutations>((set) => ({
  ...initialState,
  setUserState: (value: Partial<UserState>) => set((state) => ({ ...state, ...value })),
  addError: (error: Error) =>
    set((state) => ({ ...state, errors: { ...state.errors, [error.code]: error } })),
  clearErrors: () => set((state) => ({ ...state, errors: {} })),
  clearUser: () => set(() => initialState),
}));

export default userState;
