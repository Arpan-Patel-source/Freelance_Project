import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Bell, MessageSquare, Briefcase, IndianRupee, Star, Check, CheckCheck } from 'lucide-react';
import useNotificationStore from '../store/useNotificationStore';
import { formatDistanceToNow } from 'date-fns';

const iconMap = {
    proposal: Briefcase,
    message: MessageSquare,
    contract: Briefcase,
    payment: IndianRupee,
    review: Star,
    job: Briefcase
};

const colorMap = {
    proposal: 'from-blue-500 to-indigo-500',
    message: 'from-green-500 to-emerald-500',
    contract: 'from-purple-500 to-pink-500',
    payment: 'from-yellow-500 to-orange-500',
    review: 'from-red-500 to-rose-500',
    job: 'from-cyan-500 to-blue-500'
};

export default function Notifications() {
    const navigate = useNavigate();
    const { notifications, unreadCount, loading, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleNotificationClick = async (notification) => {
        if (!notification.isRead) {
            await markAsRead(notification._id);
        }
        if (notification.link) {
            navigate(notification.link);
        }
    };

    const formatDate = (date) => {
        try {
            return formatDistanceToNow(new Date(date), { addSuffix: true });
        } catch {
            return 'Recently';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-5xl font-bold mb-2 text-gradient">Notifications</h1>
                            <p className="text-xl text-muted-foreground">
                                {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                            </p>
                        </div>
                        {unreadCount > 0 && (
                            <Button
                                onClick={markAllAsRead}
                                variant="outline"
                                className="border-2 hover:bg-purple-50"
                            >
                                <CheckCheck className="h-4 w-4 mr-2" />
                                Mark All as Read
                            </Button>
                        )}
                    </div>
                </div>

                {/* Notifications List */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Loading notifications...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="inline-flex p-6 bg-gray-100 rounded-full mb-4">
                            <Bell className="h-12 w-12 text-gray-400" />
                        </div>
                        <p className="text-muted-foreground text-xl">No notifications yet</p>
                        <p className="text-sm text-muted-foreground mt-2">We'll notify you when something important happens</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((notification, index) => {
                            const Icon = iconMap[notification.type] || Bell;
                            const gradientColor = colorMap[notification.type] || 'from-gray-500 to-slate-500';

                            return (
                                <Card
                                    key={notification._id}
                                    className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${!notification.isRead
                                        ? 'border-2 border-purple-300 bg-purple-50/50'
                                        : 'border hover:border-purple-200'
                                        }`}
                                    onClick={() => handleNotificationClick(notification)}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`flex-shrink-0 p-3 bg-gradient-to-br ${gradientColor} rounded-xl`}>
                                                <Icon className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1">
                                                        <h3 className="text-base font-semibold text-gray-900 mb-1">
                                                            {notification.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 mb-2">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            {formatDate(notification.createdAt)}
                                                        </p>
                                                    </div>
                                                    {!notification.isRead && (
                                                        <div className="flex-shrink-0">
                                                            <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Empty State Action */}
                {notifications.length === 0 && !loading && (
                    <div className="text-center mt-6">
                        <Button
                            onClick={() => navigate('/jobs')}
                            className="bg-gradient-to-r from-purple-800 to-pink-600 hover:from-indigo-700 hover:to-purple-700"
                        >
                            Browse Jobs
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
