import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Bell, MessageSquare, Briefcase, DollarSign, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const iconMap = {
    proposal: Briefcase,
    message: MessageSquare,
    contract: Briefcase,
    payment: DollarSign,
    review: Star,
    job: Briefcase
};

const NotificationToast = ({ notification, onClose }) => {
    const navigate = useNavigate();
    const Icon = iconMap[notification.type] || Bell;

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // Auto-close after 5 seconds

        return () => clearTimeout(timer);
    }, [onClose]);

    const handleClick = () => {
        if (notification.link) {
            navigate(notification.link);
            onClose();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-2xl border-2 border-purple-200 p-4 mb-3 cursor-pointer hover:shadow-xl transition-shadow max-w-sm"
            onClick={handleClick}
        >
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                    <Icon className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                            {notification.title}
                        </h4>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Just now</p>
                </div>
            </div>
        </motion.div>
    );
};

export const NotificationContainer = ({ notifications, onClose }) => {
    return (
        <div className="fixed top-20 right-4 z-50 pointer-events-none">
            <div className="pointer-events-auto">
                <AnimatePresence>
                    {notifications.map((notification) => (
                        <NotificationToast
                            key={notification._id || notification.timestamp}
                            notification={notification}
                            onClose={() => onClose(notification._id || notification.timestamp)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default NotificationToast;
