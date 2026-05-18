import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api.js';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async () => (await api.get('/users/wishlist')).data);
export const toggleWishlist = createAsyncThunk('wishlist/toggle', async (productId) => (await api.post(`/users/wishlist/${productId}`)).data);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchWishlist.fulfilled, (state, action) => {
      state.items = action.payload;
    });
    builder.addCase(toggleWishlist.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  }
});

export default wishlistSlice.reducer;
