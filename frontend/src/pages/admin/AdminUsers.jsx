import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import api from '../../lib/api';
import {
    Users,
    Search,
    AlertCircle,
    CheckCircle,
    XCircle,
    Trash2,
    RefreshCw,
    ArrowLeft
} from 'lucide-react';
import { formatDateTime, getInitials } from '../../lib/utils';
import ScrollReveal from '../../components/ScrollReveal';
import { useNavigate } from 'react-router-dom';

export default function AdminUsers() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            console.error('Error details:', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSuspendUser = async (userId, currentStatus) => {
        if (!window.confirm(`Are you sure you want to ${currentStatus ? 'unsuspend' : 'suspend'} this user?`)) {
            return;
        }

        try {
            await api.put(`/admin/users/${userId}/suspend`, { suspended: !currentStatus });
            console.log(`User ${currentStatus ? 'unsuspended' : 'suspended'} successfully`);
            fetchUsers();
        } catch (error) {
            console.error('Failed to suspend user:', error);
            console.error('Error details:', error.response?.data || error.message);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone!')) {
            return;
        }

        try {
            await api.delete(`/admin/users/${userId}`);
            console.log('User deleted successfully');
            fetchUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
            console.error('Error details:', error.response?.data || error.message);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="text-center">
                    <RefreshCw className="h-12 w-12 animate-spin text-red-500 mx-auto mb-4" />
                    <p className="text-lg text-white">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <ScrollReveal>
                    <div className="mb-8">
                        <div className="glass-dark rounded-3xl p-8 shadow-xl border-2 border-red-900/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigate('/admin/dashboard')}
                                        className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back
                                    </Button>
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-gradient-to-br from-red-600 to-orange-500 rounded-xl">
                                                <Users className="h-6 w-6 text-white" />
                                            </div>
                                            <h1 className="text-4xl font-bold text-white">User Management</h1>
                                        </div>
                                        <p className="text-gray-300 ml-14">
                                            Manage all platform users ({filteredUsers.length} total)
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={fetchUsers}
                                    className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Refresh
                                </Button>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

                {/* Filters */}
                <Card className="mb-6 border-2 border-red-900/50 bg-slate-800/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-white">Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                <option value="all">All Roles</option>
                                <option value="freelancer">Freelancers</option>
                                <option value="client">Clients</option>
                                <option value="admin">Admins</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Users List */}
                <Card className="border-2 border-red-900/50 bg-slate-800/50 backdrop-blur-sm">
                    <CardHeader className="border-b border-red-900/50">
                        <CardTitle className="text-white">Users</CardTitle>
                        <CardDescription className="text-gray-400">
                            All registered users on the platform
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {filteredUsers.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No users found</p>
                        ) : (
                            <div className="space-y-4">
                                {filteredUsers.map((user, index) => (
                                    <ScrollReveal key={user._id} delay={index * 30}>
                                        <div className="p-4 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 flex-1">
                                                    <Avatar className="h-12 w-12 border-2 border-red-500">
                                                        <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-500 text-white font-semibold text-lg">
                                                            {getInitials(user.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-semibold text-white text-lg">{user.name}</h3>
                                                            <Badge className={
                                                                user.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                                                                    user.role === 'freelancer' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                                                                        'bg-green-500/20 text-green-300 border-green-500/30'
                                                            }>
                                                                {user.role}
                                                            </Badge>
                                                            {user.isEmailVerified ? (
                                                                <CheckCircle className="h-4 w-4 text-green-400" title="Email Verified" />
                                                            ) : (
                                                                <AlertCircle className="h-4 w-4 text-yellow-400" title="Email Not Verified" />
                                                            )}
                                                            {user.suspended && (
                                                                <XCircle className="h-4 w-4 text-red-400" title="Suspended" />
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-400">{user.email}</p>
                                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                            <span>Joined: {formatDateTime(user.createdAt).split(' at ')[0]}</span>
                                                            {user.role === 'freelancer' && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span>Rating: {user.rating?.toFixed(1) || '0.0'} ⭐</span>
                                                                    <span>•</span>
                                                                    <span>Completed: {user.completedJobs || 0}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                {user.role !== 'admin' && (
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleSuspendUser(user._id, user.suspended)}
                                                            className={user.suspended ?
                                                                'bg-green-500/20 hover:bg-green-500/30 text-green-300 border-green-500/30' :
                                                                'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border-yellow-500/30'
                                                            }
                                                        >
                                                            {user.suspended ? 'Unsuspend' : 'Suspend'}
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleDeleteUser(user._id)}
                                                            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/30"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </ScrollReveal>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
