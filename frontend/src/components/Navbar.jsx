import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Bell, Briefcase, MessageSquare, User, LogOut, FileText, Sparkles } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useNotificationStore from '../store/useNotificationStore';
import { getInitials } from '../lib/utils';
import { useEffect } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { unreadCount, fetchNotifications } = useNotificationStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated, fetchNotifications]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-lg shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-br from-purple-800 to-pink-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-800 to-pink-600 bg-clip-text text-transparent">Worksera</span>
          </Link>

          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/jobs" className="text-sm font-medium hover:text-indigo-600 transition-colors relative group">
                  Browse Jobs
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                {user?.role === 'client' && (
                  <>
                    <Link to="/post-job" className="text-sm font-medium hover:text-indigo-600 transition-colors relative group">
                      Post a Job
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                    <Link to="/my-jobs" className="text-sm font-medium hover:text-indigo-600 transition-colors relative group">
                      My Jobs
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </>
                )}
                <Link to="/contracts" className="text-sm font-medium hover:text-indigo-600 transition-colors relative group">
                  Contracts
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link to="/messages" className="relative p-2 hover:bg-indigo-50 rounded-lg transition-colors group">
                  <MessageSquare className="h-5 w-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </Link>
                <Link to="/notifications" className="relative p-2 hover:bg-indigo-50 rounded-lg transition-colors group">
                  <Bell className={`h-5 w-5 transition-colors ${unreadCount > 0 ? 'text-purple-600 animate-bounce-subtle' : 'text-gray-600 group-hover:text-indigo-600'}`} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse ring-2 ring-white"></span>
                  )}
                </Link>
                <div className="flex items-center space-x-3 pl-3 border-l">
                  <Link to="/dashboard" className="group">
                    <Avatar className="ring-2 ring-transparent group-hover:ring-indigo-600 transition-all duration-300">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-500 text-white">
                        {getInitials(user?.name || 'U')}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="hover:bg-red-50 hover:text-red-600 transition-colors">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/jobs" className="text-sm font-medium hover:text-indigo-600 transition-colors relative group">
                  Browse Jobs
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link to="/login" className="text-sm font-medium hover:text-indigo-600 transition-colors relative group">
                  Login
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link to="/register">
                  <Button className="bg-gradient-to-r from-purple-800 to-pink-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Sign Up Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
