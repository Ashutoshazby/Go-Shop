import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api.js';

const localItems = JSON.parse(localStorage.getItem('goShopCart') || '[]');

export const fetchCart = createAsyncThunk('cart/fetch', async () => (await api.get('/cart')).data);
export const addCartItem = createAsyncThunk('cart/add', async (payload) => (await api.post('/cart', payload)).data);
export const updateCartItem = createAsyncThunk('cart/update', async ({ productId, qty }) => (await api.put(`/cart/${productId}`, { qty })).data);
export const removeCartItem = createAsyncThunk('cart/remove', async (productId) => (await api.delete(`/cart/${productId}`)).data);

const persist = (items) => localStorage.setItem('goShopCart', JSON.stringify(items));

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: localItems, coupon: null },
  reducers: {
    addLocalCart: (state, action) => {
      const item = state.items.find((cartItem) => cartItem.product._id === action.payload.product._id);
      if (item) item.qty += action.payload.qty;
      else state.items.push(action.payload);
      persist(state.items);
    },
    removeLocalCart: (state, action) => {
      state.items = state.items.filter((item) => item.product._id !== action.payload);
      persist(state.items);
    },
    setCoupon: (state, action) => {
      state.coupon = action.payload;
    }
  },
  extraReducers: (builder) => {
    [fetchCart, addCartItem, updateCartItem, removeCartItem].forEach((thunk) => {
      builder.addCase(thunk.fulfilled, (state, action) => {
        state.items = action.payload;
        persist(action.payload);
      });
    });
  }
});

export const { addLocalCart, removeLocalCart, setCoupon } = cartSlice.actions;
export default cartSlice.reducer;
