import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api.js';
import { getDemoProductDetail, getDemoProductPage } from '../../utils/demoProducts.js';

export const fetchProducts = createAsyncThunk('products/list', async (params = {}) => (await api.get('/products', { params })).data);
export const fetchProduct = createAsyncThunk('products/detail', async (id) => (await api.get(`/products/${id}`)).data);
export const saveProduct = createAsyncThunk('products/save', async (payload) => {
  if (payload._id) return (await api.put(`/products/${payload._id}`, payload)).data;
  return (await api.post('/products', payload)).data;
});
export const deleteProduct = createAsyncThunk('products/delete', async (id) => {
  await api.delete(`/products/${id}`);
  return id;
});
export const createReview = createAsyncThunk('products/review', async ({ id, review }) => (await api.post(`/products/${id}/reviews`, review)).data);

const productSlice = createSlice({
  name: 'products',
  initialState: { items: getDemoProductPage().products, detail: null, reviews: [], related: [], page: 1, pages: 1, total: getDemoProductPage().total, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        Object.assign(state, action.payload, { items: action.payload.products, loading: false });
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        const fallback = getDemoProductPage(action.meta.arg);
        Object.assign(state, fallback, { items: fallback.products, loading: false });
        state.error = action.error.message;
      })
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.detail = action.payload.product;
        state.reviews = action.payload.reviews;
        state.related = action.payload.related;
        state.loading = false;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        const fallback = getDemoProductDetail(action.meta.arg);
        state.detail = fallback.product;
        state.reviews = fallback.reviews;
        state.related = fallback.related;
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(saveProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index >= 0) state.items[index] = action.payload;
        else state.items.unshift(action.payload);
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  }
});

export default productSlice.reducer;
