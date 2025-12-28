import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import useAuthStore from '../store/useAuthStore';
import api from '../lib/api';
import {
  IndianRupee,
  Briefcase,
  Star,
  TrendingUp,
  RefreshCw,
  Sparkles,
  Zap,
  Target,
  CheckCircle,
  XCircle,
  Activity,
  Users,
  DollarSign
} from 'lucide-react';
import { formatCurrency, formatDateTime, getInitials } from '../lib/utils';
import AnimatedCounter from '../components/AnimatedCounter';
import ScrollReveal from '../components/ScrollReveal';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import {
  LineChart,
  BarChart,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

export default function Dashboard() {
  const { user, refreshUser } = useAuthStore();
  const [stats, setStats] = useState({
    activeContracts: 0,
    totalEarnings: 0,
    totalSpent: 0,
    completedJobs: 0,
    rating: 0,
    cancelledContracts: 0,
    completedContracts: 0,
    totalProposals: 0,
    acceptedProposals: 0,
    rejectedProposals: 0,
    totalJobs: 0,
  });
  const [contracts, setContracts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [earningsData, setEarningsData] = useState([]);
  const [jobsData, setJobsData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const updatedUser = await refreshUser();

      const [contractsRes, jobsRes, proposalsRes] = await Promise.all([
        api.get('/contracts'),
        updatedUser?.role === 'client' ? api.get('/jobs/client/my-jobs') : api.get('/jobs'),
        updatedUser?.role === 'freelancer' ? api.get('/proposals/my-proposals') : Promise.resolve({ data: [] })
      ]);

      const allContracts = contractsRes.data;
      const allJobs = jobsRes.data;
      const allProposals = proposalsRes.data;

      setContracts(allContracts);

      const activeContracts = allContracts.filter(c => c.status === 'active').length;
      const completedContracts = allContracts.filter(c => c.status === 'completed').length;
      const cancelledContracts = allContracts.filter(c => c.status === 'cancelled').length;
      const acceptedProposals = allProposals.filter(p => p.status === 'accepted').length;
      const rejectedProposals = allProposals.filter(p => p.status === 'rejected').length;

      // Calculate totals from contracts for admin, or use user values for regular users
      let totalEarnings = 0;
      let totalSpent = 0;
      let calculatedCompletedJobs = 0;

      if (updatedUser?.role === 'admin') {
        // For admin, calculate from all contracts
        totalEarnings = allContracts
          .filter(c => c.status === 'completed')
          .reduce((sum, c) => sum + (c.totalAmount || 0), 0);
        totalSpent = totalEarnings; // For admin view, spent = earnings (platform totals)
        calculatedCompletedJobs = completedContracts;
      } else {
        // For regular users, use their user model values
        totalEarnings = updatedUser.totalEarnings || 0;
        totalSpent = updatedUser.totalSpent || 0;
        calculatedCompletedJobs = updatedUser.completedJobs || 0;
      }

      setStats({
        activeContracts,
        totalEarnings,
        totalSpent,
        completedJobs: calculatedCompletedJobs,
        rating: updatedUser.rating || 0,
        cancelledContracts,
        completedContracts,
        totalProposals: allProposals.length,
        acceptedProposals,
        rejectedProposals,
        totalJobs: allJobs.length,
      });

      generateEarningsData(allContracts);
      generateJobsData(allContracts);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const generateEarningsData = (contracts) => {
    const monthlyData = {};
    const completedContracts = contracts.filter(c => c.status === 'completed');

    completedContracts.forEach(contract => {
      const date = new Date(contract.completedAt || contract.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, earnings: 0 };
      }

      monthlyData[monthKey].earnings += contract.totalAmount || 0;
    });

    const sortedData = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month)).slice(-6);
    const formattedData = sortedData.map(item => ({
      month: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      earnings: item.earnings
    }));

    setEarningsData(formattedData);
  };

  const generateJobsData = (contracts) => {
    const statusData = [
      { name: 'Active', value: contracts.filter(c => c.status === 'active').length, color: '#10b981' },
      { name: 'Completed', value: contracts.filter(c => c.status === 'completed').length, color: '#3b82f6' },
      { name: 'Cancelled', value: contracts.filter(c => c.status === 'cancelled').length, color: '#ef4444' },
    ];

    setJobsData(statusData.filter(item => item.value > 0));
  };

  const StatCard = ({ title, value, icon, description, gradient, isNumber }) => (
    <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-indigo-300 bg-white/90 backdrop-blur-sm">
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

  const ContractCard = ({ contract }) => {
    const isFreelancer = user?.role === 'freelancer';
    const otherParty = isFreelancer ? contract.client : contract.freelancer;

    return (
      <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-indigo-300">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-indigo-200">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
                  {getInitials(otherParty?.name || 'Unknown')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{contract.job?.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {isFreelancer ? 'Client' : 'Freelancer'}: <span className="font-medium">{otherParty?.name || 'Unknown'}</span>
                </p>
              </div>
            </div>
            <Badge
              className={
                contract.status === 'active'
                  ? 'bg-green-100 text-green-700 border-green-200'
                  : contract.status === 'completed'
                    ? 'bg-blue-100 text-blue-700 border-blue-200'
                    : contract.status === 'cancelled'
                      ? 'bg-red-100 text-red-700 border-red-200'
                      : 'bg-gray-100 text-gray-700 border-gray-200'
              }
            >
              {contract.status}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <div>
              <p className="text-xs text-muted-foreground">Contract Amount</p>
              <p className="text-lg font-bold text-gradient">{formatCurrency(contract.totalAmount)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Start Date</p>
              <p className="text-sm font-medium">{formatDateTime(contract.startDate)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">End Date</p>
              <p className="text-sm font-medium">
                {contract.endDate ? formatDateTime(contract.endDate) :
                  contract.status === 'completed' && contract.completedAt ? formatDateTime(contract.completedAt) :
                    'Ongoing'}
              </p>
            </div>
          </div>

          {contract.deliverables && contract.deliverables.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-1">Deliverables: {contract.deliverables.length}</p>
              <div className="flex gap-1">
                {contract.deliverables.slice(0, 3).map((_, idx) => (
                  <div key={idx} className="h-1 flex-1 bg-indigo-200 rounded"></div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

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
                    Advanced Analytics Dashboard - {user?.role === 'freelancer' ? 'Freelancer' : 'Client'} View
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
              description={`${stats.completedContracts} completed`}
            />
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <StatCard
              title={user?.role === 'freelancer' ? 'Total Earnings' : 'Total Spent'}
              value={formatCurrency(user?.role === 'freelancer' ? stats.totalEarnings : stats.totalSpent)}
              icon={<IndianRupee className="h-5 w-5" />}
              gradient="bg-gradient-to-br from-green-500 to-emerald-500"
              isNumber={false}
            />
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <StatCard
              title="Completed Jobs"
              value={stats.completedJobs}
              icon={<CheckCircle className="h-5 w-5" />}
              gradient="bg-gradient-to-br from-purple-500 to-pink-500"
              isNumber={true}
              description={`${stats.cancelledContracts} cancelled`}
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

        {/* Freelancer-specific stats */}
        {user?.role === 'freelancer' && (
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <ScrollReveal delay={0}>
              <StatCard
                title="Total Proposals"
                value={stats.totalProposals}
                icon={<Activity className="h-5 w-5" />}
                gradient="bg-gradient-to-br from-indigo-500 to-purple-500"
                isNumber={true}
              />
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <StatCard
                title="Accepted Proposals"
                value={stats.acceptedProposals}
                icon={<CheckCircle className="h-5 w-5" />}
                gradient="bg-gradient-to-br from-green-500 to-teal-500"
                isNumber={true}
                description={`${stats.totalProposals > 0 ? ((stats.acceptedProposals / stats.totalProposals) * 100).toFixed(0) : 0}% success rate`}
              />
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <StatCard
                title="Rejected Proposals"
                value={stats.rejectedProposals}
                icon={<XCircle className="h-5 w-5" />}
                gradient="bg-gradient-to-br from-red-500 to-pink-500"
                isNumber={true}
              />
            </ScrollReveal>
          </div>
        )}

        {/* Client-specific stats */}
        {user?.role === 'client' && (
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <ScrollReveal delay={0}>
              <StatCard
                title="Total Jobs Posted"
                value={stats.totalJobs}
                icon={<Briefcase className="h-5 w-5" />}
                gradient="bg-gradient-to-br from-indigo-500 to-purple-500"
                isNumber={true}
              />
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <StatCard
                title="Active Freelancers"
                value={stats.activeContracts}
                icon={<Users className="h-5 w-5" />}
                gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
                isNumber={true}
              />
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <StatCard
                title="Average Project Cost"
                value={stats.completedContracts > 0 ? formatCurrency(stats.totalSpent / stats.completedContracts) : formatCurrency(0)}
                icon={<DollarSign className="h-5 w-5" />}
                gradient="bg-gradient-to-br from-purple-500 to-pink-500"
                isNumber={false}
              />
            </ScrollReveal>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Earnings/Spending Chart */}
          <Card className="border-2 hover:border-indigo-200 transition-all duration-300 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {user?.role === 'freelancer' ? 'Earnings' : 'Spending'} Over Time
              </CardTitle>
              <CardDescription>Last 6 months trend</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={earningsData}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="earnings" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorEarnings)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Contract Status Chart */}
          <Card className="border-2 hover:border-indigo-200 transition-all duration-300 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Contract Status Distribution
              </CardTitle>
              <CardDescription>Current contract breakdown</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={jobsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {jobsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Contracts List */}
        <Card className="border-2 hover:border-indigo-200 transition-all duration-300 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-800 to-pink-600 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">All Contracts</CardTitle>
                <CardDescription className="text-base">
                  Detailed view with {user?.role === 'freelancer' ? 'client' : 'freelancer'} information
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {contracts.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                  <Target className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-muted-foreground text-lg">No contracts yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {user?.role === 'freelancer' ? 'Start browsing jobs to get started!' : 'Post a job to hire freelancers!'}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {contracts.map((contract, index) => (
                  <ScrollReveal key={contract._id} delay={index * 50}>
                    <ContractCard contract={contract} />
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
