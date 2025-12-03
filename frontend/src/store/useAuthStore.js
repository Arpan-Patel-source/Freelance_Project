import { create } from 'zustand';
import api from '../lib/api';

const useAuthStore = create((set) => ({
  user: JSON.parse(sessionStorage.getItem('user')) || null,
  token: sessionStorage.getItem('token') || null,
  isAuthenticated: !!sessionStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      console.log('🔐 Attempting login for:', email);
      const { data } = await api.post('/auth/login', { email, password });

      console.log('✅ Login API response received');
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('user', JSON.stringify(data));
      console.log('Setting auth state:', { user: data, token: data.token, isAuthenticated: true });
      set({ user: data, token: data.token, isAuthenticated: true, loading: false });
      console.log('Auth state set successfully');
      return data;
    } catch (error) {
      console.error('❌ Login failed:', error);

      let message = 'Login failed';

      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        message = 'Cannot connect to server. Please ensure the backend is running.';
      } else if (error.response) {
        // Server responded with error
        message = error.response.data?.message || `Server error: ${error.response.status}`;
        console.error('Server response:', error.response.data);
      } else if (error.request) {
        // Request made but no response
        message = 'No response from server. Please check if backend is running.';
      }

      set({ error: message, loading: false });
      throw new Error(message);
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', userData);
      // Don't store token yet - user needs to verify email first
      set({ loading: false });
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },

  logout: () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (userData) => {
    const updatedUser = { ...useAuthStore.getState().user, ...userData };
    sessionStorage.setItem('user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },

  refreshUser: async () => {
    try {
      const { data } = await api.get('/auth/me');
      sessionStorage.setItem('user', JSON.stringify(data));
      set({ user: data });
      return data;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      throw error;
    }
  },

  setToken: (token) => {
    sessionStorage.setItem('token', token);
    set({ token, isAuthenticated: !!token });
  },

  setUser: (user) => {
    sessionStorage.setItem('user', JSON.stringify(user));
    const token = sessionStorage.getItem('token');
    set({ user, isAuthenticated: !!token && !!user });
  },
}));

export default useAuthStore;
