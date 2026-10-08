import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import { setAuthToken } from '../../api/axiosClient';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatar_url?: string | null;
  created_at?: string;
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

export const restoreLogin = createAsyncThunk(
  'auth/restoreLogin',
  async () => {
    const token = await SecureStore.getItemAsync('token');
    const userJson = await SecureStore.getItemAsync('user');

    if (!token) {
      return null;
    }

    const user: User | null = userJson
      ? JSON.parse(userJson)
      : null;

    setAuthToken(token);

    return {
      token,
      user,
    };
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    setAuthToken(null);

    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{
        token: string;
        user: User;
      }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    updateUser: (
      state,
      action: PayloadAction<Partial<User>>
    ) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreLogin.fulfilled, (state, action) => {
        if (action.payload) {
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        } else {
          state.token = null;
          state.user = null;
          state.isAuthenticated = false;
        }

        state.isRestoring = false;
      })
      .addCase(restoreLogin.rejected, (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.isRestoring = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const {
  loginSuccess,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;