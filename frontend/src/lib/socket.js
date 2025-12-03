import { io } from 'socket.io-client';

let socket = null;

export const initSocket = (userId) => {
    if (socket) {
        return socket;
    }

    socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        withCredentials: true,
        transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
        if (userId) {
            socket.emit('register', userId);
        }
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected');
    });

    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export default { initSocket, getSocket, disconnectSocket };
