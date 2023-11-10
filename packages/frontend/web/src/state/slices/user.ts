import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit';
import { UserState } from 'types';

const initialState: UserState = {
  email: '',
  token: '',
  errors: [],
};

export const userSlice: Slice<UserState> = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserState: (state, action: PayloadAction<Partial<UserState>>) => {
      state = { ...state, ...action.payload };
    },
  },
});

export const { setUserState } = userSlice.actions;

export default userSlice.reducer;
