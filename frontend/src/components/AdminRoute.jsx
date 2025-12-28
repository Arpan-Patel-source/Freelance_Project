import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function AdminRoute({ children }) {
    const { user, token } = useAuthStore();

    // Not logged in - redirect to login
    if (!token || !user) {
        console.warn('⚠️ Unauthenticated user attempted to access admin panel');
        return <Navigate to="/login" replace />;
    }

    // Logged in but not admin - redirect to regular dashboard
    if (user.role !== 'admin') {
        console.warn(`⚠️ Non-admin user (${user.email}) attempted to access admin panel`);
        return <Navigate to="/dashboard" replace />;
    }

    // User is admin - grant access
    console.log(`✅ Admin access granted to ${user.email}`);
    return children;
}
