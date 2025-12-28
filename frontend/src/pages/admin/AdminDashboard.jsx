import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import useAuthStore from '../../store/useAuthStore';
import api from '../../lib/api';
import {
    Users,
    Briefcase,
    FileText,
    DollarSign,
    TrendingUp,
    RefreshCw,
    Shield,
    Activity,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { formatCurrency, formatDateTime, getInitials } from '../../lib/utils';
import AnimatedCounter from '../../components/AnimatedCounter';
import ScrollReveal from '../../components/ScrollReveal';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';

export default function AdminDashboard() {
    const { user } = useAuthStore();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalFreelancers: 0,
        totalClients: 0,
        totalJobs: 0,
        totalContracts: 0,
        activeContracts: 0,
        completedContracts: 0,
        totalProposals: 0,
        totalRevenue: 0
    });
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentContracts, setRecentContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setRefreshing(true);
            setError(null); // Clear previous errors
            const response = await api.get('/admin/dashboard');

            setStats(response.data.stats);
            setRecentUsers(response.data.recentUsers);
            setRecentContracts(response.data.recentContracts);
        } catch (error) {
            console.error('Failed to fetch admin dashboard:', error);
            console.error('Error details:', error.response?.data || error.message);
            setError('Failed to load dashboard data. Please try refreshing.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const StatCard = ({ title, value, icon, gradient, isNumber, description }) => (
        <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-red-300 bg-white/90 backdrop-blur-sm">
            <div className={`absolute inset-0 ${gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <div className="p-2 bg-gradient-to-br from-red-600 to-orange-500 rounded-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <div className="text-white">{icon}</div>
                </div>
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-gradient">
                    {isNumber ? <AnimatedCounter end={value} /> : value}
                </div>
                {description && (
                    <p className="text-xs text-muted-foreground mt-1 font-medium">{description}</p>
                )}
            </CardContent>
        </Card>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <RefreshCw className="h-12 w-12 animate-spin text-red-500 mx-auto mb-4" />
                    <p className="text-lg">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="container mx-auto px-4 py-8">
                {/* Welcome Header */}
                <ScrollReveal>
                    <div className="mb-8 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-800 to-orange-600 rounded-3xl opacity-10"></div>
                        <div className="relative glass-dark rounded-3xl p-8 shadow-xl border-2 border-red-900/50">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-gradient-to-br from-red-600 to-orange-500 rounded-xl">
                                            <Shield className="h-6 w-6 text-white" />
                                        </div>
                                        <h1 className="text-5xl font-bold text-white">
                                            Admin Dashboard
                                        </h1>
                                    </div>
                                    <p className="text-lg text-gray-300 ml-14">
                                        Welcome back, {user?.name} • Complete platform oversight
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={fetchDashboardData}
                                    disabled={refreshing}
                                    className="bg-white/10 hover:bg-white/20 text-white border-white/20 transition-all duration-300 hover:scale-105"
                                >
                                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                                    Refresh
                                </Button>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

                {/* Error Banner */}
                {error && (
                    <ScrollReveal>
                        <div className="mb-8 p-4 bg-red-500/10 border-2 border-red-500/50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="h-5 w-5 text-red-400" />
                                <p className="text-red-300">{error}</p>
                                <Button
                                    size="sm"
                                    onClick={fetchDashboardData}
                                    className="ml-auto bg-red-600 hover:bg-red-700 text-white"
                                >
                                    Try Again
                                </Button>
                            </div>
                        </div>
                    </ScrollReveal>
                )}

                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <ScrollReveal delay={0}>
                        <StatCard
                            title="Total Users"
                            value={stats.totalUsers}
                            icon={<Users className="h-5 w-5" />}
                            gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
                            isNumber={true}
                            description={`${stats.totalFreelancers} Freelancers • ${stats.totalClients} Clients`}
                        />
                    </ScrollReveal>
                    <ScrollReveal delay={100}>
                        <StatCard
                            title="Total Jobs"
                            value={stats.totalJobs}
                            icon={<Briefcase className="h-5 w-5" />}
                            gradient="bg-gradient-to-br from-green-500 to-emerald-500"
                            isNumber={true}
                        />
                    </ScrollReveal>
                    <ScrollReveal delay={200}>
                        <StatCard
                            title="Total Contracts"
                            value={stats.totalContracts}
                            icon={<FileText className="h-5 w-5" />}
                            gradient="bg-gradient-to-br from-purple-500 to-pink-500"
                            isNumber={true}
                        />
                    </ScrollReveal>
                    <ScrollReveal delay={300}>
                        <StatCard
                            title="Platform Revenue"
                            value={formatCurrency(stats.totalRevenue)}
                            icon={<DollarSign className="h-5 w-5" />}
                            gradient="bg-gradient-to-br from-yellow-500 to-orange-500"
                            isNumber={false}
                            description="From completed contracts"
                        />
                    </ScrollReveal>
                </div>

                {/* Recent Activity */}
                <div className="grid gap-6 lg:grid-cols-2 mb-8">
                    {/* Recent Users */}
                    <Card className="border-2 border-red-900/50 bg-slate-800/50 backdrop-blur-sm">
                        <CardHeader className="border-b border-red-900/50">
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Users className="h-5 w-5 text-red-500" />
                                Recent Users
                            </CardTitle>
                            <CardDescription className="text-gray-400">Latest user registrations</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {recentUsers.length === 0 ? (
                                <p className="text-gray-400 text-center py-4">No recent users</p>
                            ) : (
                                <div className="space-y-4">
                                    {recentUsers.map((user, index) => (
                                        <ScrollReveal key={user._id} delay={index * 50}>
                                            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 border-2 border-red-500">
                                                        <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-500 text-white font-semibold">
                                                            {getInitials(user.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-semibold text-white">{user.name}</p>
                                                        <p className="text-sm text-gray-400">{user.email}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <Badge className={
                                                        user.role === 'freelancer'
                                                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                                            : 'bg-green-500/20 text-green-300 border-green-500/30'
                                                    }>
                                                        {user.role}
                                                    </Badge>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {formatDateTime(user.createdAt).split(' at ')[0]}
                                                    </p>
                                                </div>
                                            </div>
                                        </ScrollReveal>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Contracts */}
                    <Card className="border-2 border-red-900/50 bg-slate-800/50 backdrop-blur-sm">
                        <CardHeader className="border-b border-red-900/50">
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Activity className="h-5 w-5 text-red-500" />
                                Recent Contracts
                            </CardTitle>
                            <CardDescription className="text-gray-400">Latest contract activity</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {recentContracts.length === 0 ? (
                                <p className="text-gray-400 text-center py-4">No recent contracts</p>
                            ) : (
                                <div className="space-y-4">
                                    {recentContracts.map((contract, index) => (
                                        <ScrollReveal key={contract._id} delay={index * 50}>
                                            <div className="p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h4 className="font-semibold text-white">{contract.job?.title}</h4>
                                                    <Badge className={
                                                        contract.status === 'active'
                                                            ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                                            : contract.status === 'completed'
                                                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                                                : 'bg-red-500/20 text-red-300 border-red-500/30'
                                                    }>
                                                        {contract.status}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="text-gray-400">
                                                        <span className="text-gray-500">Client:</span> {contract.client?.name}
                                                        <span className="mx-2">•</span>
                                                        <span className="text-gray-500">Freelancer:</span> {contract.freelancer?.name}
                                                    </div>
                                                    <span className="font-semibold text-green-400">{formatCurrency(contract.totalAmount)}</span>
                                                </div>
                                            </div>
                                        </ScrollReveal>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card className="border-2 border-red-900/50 bg-slate-800/50 backdrop-blur-sm">
                    <CardHeader className="border-b border-red-900/50">
                        <CardTitle className="text-white">Quick Actions</CardTitle>
                        <CardDescription className="text-gray-400">Commonly used admin functions</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid gap-4 md:grid-cols-3">
                            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => window.location.href = '/admin/users'}>
                                <Users className="h-4 w-4 mr-2" />
                                Manage Users
                            </Button>
                            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => window.location.href = '/admin/jobs'}>
                                <Briefcase className="h-4 w-4 mr-2" />
                                View Jobs
                            </Button>
                            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => window.location.href = '/admin/contracts'}>
                                <FileText className="h-4 w-4 mr-2" />
                                View Contracts
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
