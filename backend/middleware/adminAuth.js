import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const isAdmin = async (req, res, next) => {
    try {
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        // Check if user has admin role
        if (req.user.role !== 'admin') {
            // Log unauthorized attempt
            const logEntry = {
                timestamp: new Date().toISOString(),
                user: req.user.email,
                userId: req.user._id,
                role: req.user.role,
                attemptedRoute: req.originalUrl,
                ip: req.ip || req.connection.remoteAddress,
                method: req.method
            };

            // Create logs directory if it doesn't exist
            const logsDir = path.join(__dirname, '../logs');
            if (!fs.existsSync(logsDir)) {
                fs.mkdirSync(logsDir, { recursive: true });
            }

            // Append to log file
            fs.appendFileSync(
                path.join(logsDir, 'unauthorized-admin-attempts.log'),
                JSON.stringify(logEntry) + '\n'
            );

            console.warn(`⚠️  Unauthorized admin access attempt by ${req.user.email} to ${req.originalUrl}`);

            return res.status(403).json({
                message: 'Access denied. Admin privileges required.'
            });
        }

        // User is admin, allow access
        console.log(`✅ Admin access granted to ${req.user.email} for ${req.originalUrl}`);
        next();
    } catch (error) {
        console.error('Admin auth error:', error);
        res.status(500).json({ message: 'Server error during authorization' });
    }
};
