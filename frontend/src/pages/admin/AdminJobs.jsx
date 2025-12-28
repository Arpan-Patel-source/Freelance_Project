import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import api from '../../lib/api';
import {
    Briefcase,
    Search,
    RefreshCw,
    ArrowLeft,
    DollarSign,
    Calendar,
    User
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import ScrollReveal from '../../components/ScrollReveal';
import { useNavigate } from 'react-router-dom';

export default function AdminJobs() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/jobs');
            setJobs(response.data);
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
            console.error('Error details:', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="text-center">
                    <RefreshCw className="h-12 w-12 animate-spin text-red-500 mx-auto mb-4" />
                    <p className="text-lg text-white">Loading jobs...</p>
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
                                                <Briefcase className="h-6 w-6 text-white" />
                                            </div>
                                            <h1 className="text-4xl font-bold text-white">Jobs Management</h1>
                                        </div>
                                        <p className="text-gray-300 ml-14">
                                            View all jobs posted on the platform ({filteredJobs.length} total)
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={fetchJobs}
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
                                    placeholder="Search jobs..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                <option value="all">All Status</option>
                                <option value="open">Open</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Jobs List */}
                <Card className="border-2 border-red-900/50 bg-slate-800/50 backdrop-blur-sm">
                    <CardHeader className="border-b border-red-900/50">
                        <CardTitle className="text-white">All Jobs</CardTitle>
                        <CardDescription className="text-gray-400">
                            Complete list of jobs on the platform
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {filteredJobs.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No jobs found</p>
                        ) : (
                            <div className="space-y-4">
                                {filteredJobs.map((job, index) => (
                                    <ScrollReveal key={job._id} delay={index * 30}>
                                        <div className="p-5 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="text-xl font-semibold text-white">{job.title}</h3>
                                                        <Badge className={
                                                            job.status === 'open' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                                                                job.status === 'in-progress' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                                                                    job.status === 'completed' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                                                                        'bg-gray-500/20 text-gray-300 border-gray-500/30'
                                                        }>
                                                            {job.status}
                                                        </Badge>
                                                        <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                                                            {job.type}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-gray-300 mb-3 line-clamp-2">{job.description}</p>

                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <DollarSign className="h-4 w-4 text-green-400" />
                                                            <span className="text-gray-400">Budget:</span>
                                                            <span className="text-white font-semibold">
                                                                {job.budgetType === 'fixed' ? formatCurrency(job.budget) : `${formatCurrency(job.hourlyRateMin)}-${formatCurrency(job.hourlyRateMax)}/hr`}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <User className="h-4 w-4 text-blue-400" />
                                                            <span className="text-gray-400">Client:</span>
                                                            <span className="text-white">{job.client?.name || 'Unknown'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Calendar className="h-4 w-4 text-purple-400" />
                                                            <span className="text-gray-400">Posted:</span>
                                                            <span className="text-white">{formatDateTime(job.createdAt).split(' at ')[0]}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Briefcase className="h-4 w-4 text-yellow-400" />
                                                            <span className="text-gray-400">Level:</span>
                                                            <span className="text-white capitalize">{job.experienceLevel}</span>
                                                        </div>
                                                    </div>

                                                    {job.skills && job.skills.length > 0 && (
                                                        <div className="flex flex-wrap gap-2">
                                                            {job.skills.map((skill, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="px-2 py-1 text-xs bg-red-500/20 text-red-300 rounded-md border border-red-500/30"
                                                                >
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
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
