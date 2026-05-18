import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api.js';

const savedUser = JSON.parse(localStorage.getItem('goShopUser') || 'null');

export const login = createAsyncThunk('auth/login', async (payload) => (await api.post('/auth/login', payload)).data);
export const register = createAsyncThunk('auth/register', async (payload) => (await api.post('/auth/register', payload)).data);
export const loadMe = createAsyncThunk('auth/me', async () => (await api.get('/auth/me')).data);
export const updateProfile = createAsyncThunk('auth/profile', async (payload) => (await api.put('/auth/profile', payload)).data);

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: savedUser, token: localStorage.getItem('goShopToken'), loading: false, error: null },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('goShopToken');
      localStorage.removeItem('goShopUser');
    }
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const rejected = (state, action) => {
      state.loading = false;
      state.error = action.error.message || action.payload?.message;
    };
    const fulfilledAuth = (state, action) => {
      state.loading = false;
      state.user = action.payload.user || action.payload;
      state.token = action.payload.token || state.token;
      if (action.payload.token) localStorage.setItem('goShopToken', action.payload.token);
      localStorage.setItem('goShopUser', JSON.stringify(state.user));
    };
    builder
      .addCase(login.pending, pending)
      .addCase(login.fulfilled, fulfilledAuth)
      .addCase(login.rejected, rejected)
      .addCase(register.pending, pending)
      .addCase(register.fulfilled, fulfilledAuth)
      .addCase(register.rejected, rejected)
      .addCase(loadMe.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem('goShopUser', JSON.stringify(action.payload));
      })
      .addCase(updateProfile.fulfilled, fulfilledAuth);
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
