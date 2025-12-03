import { create } from 'zustand';
import api from '../lib/api';

const useNotificationStore = create((set, get) => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,

    // Fetch all notifications
    fetchNotifications: async () => {
        try {
            set({ loading: true, error: null });
            const { data } = await api.get('/notifications');
            const unreadCount = data.filter(n => !n.isRead).length;
            set({ notifications: data, unreadCount, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch notifications', loading: false });
        }
    },

    // Add new notification (from Socket.IO)
    addNotification: (notification) => {
        set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadCount: state.unreadCount + 1
        }));
    },

    // Mark notification as read
    markAsRead: async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            set((state) => ({
                notifications: state.notifications.map(n =>
                    n._id === id ? { ...n, isRead: true } : n
                ),
                unreadCount: Math.max(0, state.unreadCount - 1)
            }));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    },

    // Mark all as read
    markAllAsRead: async () => {
        try {
            await api.put('/notifications/read-all');
            set((state) => ({
                notifications: state.notifications.map(n => ({ ...n, isRead: true })),
                unreadCount: 0
            }));
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    },

    // Clear error
    clearError: () => set({ error: null }),
}));

export default useNotificationStore;
