import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';

interface User {
  id?: string;
  name?: string;
  email?: string;
  [key: string]: any;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isRestoring: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  isRestoring: true,
};

export const restoreLogin = createAsyncThunk('auth/restore', async () => {
  const token = await SecureStore.getItemAsync('token');
  const userJs = await SecureStore.getItemAsync('user');
  if (!token) throw new Error("Chưa Đăng Nhập");
  return { token, user: userJs ? JSON.parse(userJs) : null };
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ token: string; user: any }>) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      SecureStore.setItemAsync('token', token);
      SecureStore.setItemAsync('user', JSON.stringify(user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      SecureStore.deleteItemAsync('token');
      SecureStore.deleteItemAsync('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreLogin.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isRestoring = false;
      })
      .addCase(restoreLogin.rejected, (state) => {
        state.isRestoring = false;
      });
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;