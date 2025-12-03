import { useEffect, useState } from 'react';
import { initSocket, disconnectSocket } from '../lib/socket';
import useAuthStore from '../store/useAuthStore';
import useNotificationStore from '../store/useNotificationStore';

export const useSocketNotifications = () => {
    const { user, isAuthenticated } = useAuthStore();
    const { addNotification } = useNotificationStore();
    const [toastNotifications, setToastNotifications] = useState([]);

    useEffect(() => {
        if (!isAuthenticated || !user?._id) {
            disconnectSocket();
            return;
        }

        const socket = initSocket(user._id);

        // Listen for notifications
        socket.on('notification', (notification) => {
            console.log('Received notification:', notification);

            // Add to store
            addNotification(notification);

            // Add to toast queue with timestamp
            setToastNotifications(prev => [
                ...prev,
                { ...notification, timestamp: Date.now() }
            ]);
        });

        return () => {
            socket.off('notification');
        };
    }, [isAuthenticated, user?._id, addNotification]);

    const removeToast = (id) => {
        setToastNotifications(prev => prev.filter(n =>
            (n._id || n.timestamp) !== id
        ));
    };

    return { toastNotifications, removeToast };
};
