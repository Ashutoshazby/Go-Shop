import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { darkMode: localStorage.getItem('goShopTheme') === 'dark' },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('goShopTheme', state.darkMode ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', state.darkMode);
    },
    syncTheme: (state) => {
      document.documentElement.classList.toggle('dark', state.darkMode);
    }
  }
});

export const { toggleDarkMode, syncTheme } = uiSlice.actions;
export default uiSlice.reducer;
