import { createSlice } from '@reduxjs/toolkit';
import api from 'api';

const apiClient = new api();
apiClient.configure(import.meta.env.VITE_API_URL);

const apiClientSlice = createSlice({
  name: 'apiClient',
  initialState: apiClient,
  reducers: {},
});

export default apiClientSlice.reducer;
