import { UserState, Error, UserType } from 'types';
import { create } from 'zustand';

const initialState: UserState = {
  id: '',
  name: '',
  lastName: '',
  pictureUrl: '',
  email: '',
  token: '',
  refreshToken: '',
  errors: {},
  type: UserType.PERSON,
};

type UserMutations = {
  setUserState: (value: Partial<UserState>) => void;
  clearErrors: () => void;
  clearUser: () => void;
  addError: (error: Error) => void;
  removeToken: () => void;
  initializeTokenCheck: () => void;
};

const userState = create<UserState & UserMutations>((set, get) => ({
  ...initialState,
  setUserState: (value: Partial<UserState>) => set((state) => ({ ...state, ...value })),
  addError: (error: Error) =>
    set((state) => ({ ...state, errors: { ...state.errors, [error.code]: error } })),
  clearErrors: () => set((state) => ({ ...state, errors: {} })),
  clearUser: () => set(() => initialState),
  removeToken: () => {
    sessionStorage.removeItem('token');
    set({ token: undefined });
  },
  initializeTokenCheck: () => {
    setInterval(
      () => {
        const token = get().token;
        if (token) {
          const isTokenExpired = false;
          if (isTokenExpired) {
            get().removeToken();
          }
        }
      },
      1000 * 60 * 60,
    );
  },
}));

export default userState;
