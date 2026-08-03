import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: localStorage.getItem('theme') || 'light',
  sidebarOpen: true,
  sidebarCollapsed: false,
  toasts: [],
  modalStack: [],
  notifications: [],
  isLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleSidebarCollapse(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    addToast(state, action) {
      state.toasts.push({
        id: Date.now().toString(),
        duration: 3000,
        ...action.payload,
      });
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    openModal(state, action) {
      state.modalStack.push(action.payload);
    },
    closeModal(state) {
      state.modalStack.pop();
    },
    setGlobalLoading(state, action) {
      state.isLoading = action.payload;
    },
    setNotifications(state, action) {
      state.notifications = action.payload;
    },
  },
});

export const {
  setTheme,
  toggleSidebar,
  toggleSidebarCollapse,
  addToast,
  removeToast,
  openModal,
  closeModal,
  setGlobalLoading,
  setNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;
