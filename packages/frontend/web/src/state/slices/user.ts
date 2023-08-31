import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: '',
  token: '',
};

export const userSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setUser: (state, action: { payload: typeof initialState }) => {
      state = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
