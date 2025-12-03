import { useEffect, useRef } from 'react';
import useAuthStore from '../store/useAuthStore';

/**
 * Custom hook to automatically logout user after 10 minutes of inactivity
 * Tracks user activity (mouse, keyboard, touch, scroll) and resets timer on activity
 */
const useIdleTimeout = () => {
    const { isAuthenticated, logout } = useAuthStore();
    const timeoutRef = useRef(null);
    const IDLE_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds

    const resetTimer = () => {
        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Only set timer if user is authenticated
        if (isAuthenticated) {
            timeoutRef.current = setTimeout(() => {
                console.log('⏰ Session expired due to inactivity');
                logout();
            }, IDLE_TIMEOUT);
        }
    };

    useEffect(() => {
        // Only track activity if user is authenticated
        if (!isAuthenticated) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            return;
        }

        // Activity events to track
        const events = [
            'mousedown',
            'mousemove',
            'keypress',
            'scroll',
            'touchstart',
            'click'
        ];

        // Reset timer on any activity
        const handleActivity = () => {
            resetTimer();
        };

        // Add event listeners
        events.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        // Initialize timer
        resetTimer();

        // Cleanup
        return () => {
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isAuthenticated, logout]);

    return null;
};

export default useIdleTimeout;
