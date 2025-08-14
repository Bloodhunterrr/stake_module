import type {AuthState} from '@/types/auth';
import { createSlice } from '@reduxjs/toolkit';

const initialState: AuthState = {
  accessToken: localStorage.getItem('token') || null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { access_token, user } = action.payload;
      state.accessToken = access_token;
      state.user = user;
      localStorage.setItem('token', access_token);
    },
    setUser: (state, action) => {
      const { user } = action.payload;
      state.user = user;
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      localStorage.removeItem('token');
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;

export default authSlice.reducer;