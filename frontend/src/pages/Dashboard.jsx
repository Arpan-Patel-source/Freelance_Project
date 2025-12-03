import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import useAuthStore from '../store/useAuthStore';
import api from '../lib/api';
import { DollarSign, Briefcase, Star, TrendingUp, RefreshCw, Sparkles, Zap, Target, Award } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import AnimatedCounter from '../components/AnimatedCounter';
import ScrollReveal from '../components/ScrollReveal';

export default function Dashboard() {
  const { user, refreshUser } = useAuthStore();
  const [stats, setStats] = useState({
    activeContracts: 0,
    totalEarnings: 0,
    completedJobs: 0,
    rating: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      // Refresh user data to get latest stats
      const updatedUser = await refreshUser();

      const [contractsRes] = await Promise.all([
        api.get('/contracts'),
      ]);

      const activeContracts = contractsRes.data.filter(c => c.status === 'active').length;

      setStats({
        activeContracts,
        totalEarnings: updatedUser.totalEarnings || 0,
        completedJobs: updatedUser.completedJobs || 0,
        rating: updatedUser.rating || 0,
      });

      setRecentActivity(contractsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const StatCard = ({ title, value, icon, description, gradient, isNumber }) => (
    <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-indigo-300 bg-white/90 backdrop-blur-sm hover-lift glow-hover">
      <div className={`absolute inset-0 ${gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <ScrollReveal>
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-800 to-pink-600 rounded-3xl opacity-5"></div>
            <div className="relative glass rounded-3xl p-8 shadow-xl border-2 border-indigo-100">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gradient-to-br from-purple-800 to-pink-600 rounded-xl animate-pulse-glow">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-5xl font-bold text-gradient">
                      Welcome back, {user?.name}!
                    </h1>
                  </div>
                  <p className="text-lg text-muted-foreground ml-14">
                    Here's what's happening with your {user?.role === 'freelancer' ? 'freelance work' : 'projects'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchDashboardData}
                  disabled={refreshing}
                  className="hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300 hover:scale-105"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <ScrollReveal delay={0}>
            <StatCard
              title="Active Contracts"
              value={stats.activeContracts}
              icon={<Briefcase className="h-5 w-5" />}
              gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
              isNumber={true}
            />
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <StatCard
              title={user?.role === 'freelancer' ? 'Total Earnings' : 'Total Spent'}
              value={formatCurrency(user?.role === 'freelancer' ? stats.totalEarnings : user?.totalSpent || 0)}
              icon={<DollarSign className="h-5 w-5" />}
              gradient="bg-gradient-to-br from-green-500 to-emerald-500"
              isNumber={false}
            />
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <StatCard
              title="Completed Jobs"
              value={stats.completedJobs}
              icon={<TrendingUp className="h-5 w-5" />}
              gradient="bg-gradient-to-br from-purple-500 to-pink-500"
              isNumber={true}
            />
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <StatCard
              title="Rating"
              value={stats.rating.toFixed(1)}
              icon={<Star className="h-5 w-5" />}
              description={`Based on ${user?.reviewCount || 0} reviews`}
              gradient="bg-gradient-to-br from-yellow-500 to-orange-500"
              isNumber={false}
            />
          </ScrollReveal>
        </div>

        {/* Recent Activity */}
        <Card className="border-2 hover:border-indigo-200 transition-all duration-300 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-800 to-pink-600 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Recent Activity</CardTitle>
                <CardDescription className="text-base">Your latest contracts and projects</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {recentActivity.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                  <Target className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-muted-foreground text-lg">
                  No recent activity
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Start browsing jobs to get started!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((contract, index) => (
                  <ScrollReveal key={contract._id} delay={index * 50}>
                    <div className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 group bg-white hover-lift">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg group-hover:scale-110 group-hover:from-indigo-500 group-hover:to-purple-600 transition-all duration-300">
                          <Briefcase className="h-5 w-5 text-indigo-600 group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <p className="font-semibold text-lg group-hover:text-indigo-600 transition-colors">
                            {contract.job?.title || 'Contract'}
                          </p>
                          <p className="text-sm text-muted-foreground font-medium">
                            {formatCurrency(contract.totalAmount)}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={
                          contract.status === 'active'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200 font-semibold'
                            : contract.status === 'completed'
                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 font-semibold'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200 font-semibold'
                        }
                      >
                        {contract.status}
                      </Badge>
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
