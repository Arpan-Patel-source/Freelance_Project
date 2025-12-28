import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Briefcase, Calendar, IndianRupee, Eye, FileText, Trash2, Edit, Users } from 'lucide-react';
import api from '../lib/api';
import { formatCurrency, formatDateTime } from '../lib/utils';
import { SkeletonJobCard } from '../components/LoadingSkeleton';
import ScrollReveal from '../components/ScrollReveal';

export default function MyJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMyJobs();
    }, []);

    const fetchMyJobs = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/jobs/client/my-jobs');
            setJobs(data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch your jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (jobId) => {
        if (!window.confirm('Are you sure you want to delete this job?')) {
            return;
        }

        try {
            await api.delete(`/jobs/${jobId}`);
            setJobs(jobs.filter(job => job._id !== jobId));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete job');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'open':
                return 'bg-green-100 text-green-700 border-green-300';
            case 'in_progress':
                return 'bg-blue-100 text-blue-700 border-blue-300';
            case 'completed':
                return 'bg-gray-100 text-gray-700 border-gray-300';
            case 'closed':
                return 'bg-red-100 text-red-700 border-red-300';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };

    const getStatusLabel = (status) => {
        return status.replace('_', ' ').toUpperCase();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-5xl font-bold mb-4 text-gradient">My Posted Jobs</h1>
                            <p className="text-xl text-muted-foreground">
                                Manage and track all your job postings
                            </p>
                        </div>
                        <Link to="/post-job">
                            <Button className="bg-gradient-to-r from-purple-800 to-pink-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                                <Briefcase className="h-4 w-4 mr-2" />
                                Post New Job
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card className="border-2 hover:border-purple-200 transition-all">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Jobs</p>
                                    <p className="text-3xl font-bold text-purple-600">{jobs.length}</p>
                                </div>
                                <Briefcase className="h-8 w-8 text-purple-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-2 hover:border-green-200 transition-all">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Open</p>
                                    <p className="text-3xl font-bold text-green-600">
                                        {jobs.filter(j => j.status === 'open').length}
                                    </p>
                                </div>
                                <FileText className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-2 hover:border-blue-200 transition-all">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">In Progress</p>
                                    <p className="text-3xl font-bold text-blue-600">
                                        {jobs.filter(j => j.status === 'in_progress').length}
                                    </p>
                                </div>
                                <Users className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-2 hover:border-gray-200 transition-all">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Completed</p>
                                    <p className="text-3xl font-bold text-gray-600">
                                        {jobs.filter(j => j.status === 'completed').length}
                                    </p>
                                </div>
                                <Calendar className="h-8 w-8 text-gray-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Jobs List */}
                {error ? (
                    <div className="text-center py-12">
                        <p className="text-destructive text-lg font-semibold">{error}</p>
                        <Button onClick={fetchMyJobs} className="mt-4 bg-gradient-to-r from-purple-800 to-pink-600">
                            Try Again
                        </Button>
                    </div>
                ) : loading ? (
                    <div className="grid gap-6">
                        {[...Array(3)].map((_, i) => (
                            <SkeletonJobCard key={i} />
                        ))}
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="inline-flex p-6 bg-gray-100 rounded-full mb-4">
                            <Briefcase className="h-12 w-12 text-gray-400" />
                        </div>
                        <p className="text-muted-foreground text-xl mb-4">No jobs posted yet</p>
                        <Link to="/post-job">
                            <Button className="bg-gradient-to-r from-purple-800 to-pink-600">
                                Post Your First Job
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {jobs.map((job, index) => (
                            <ScrollReveal key={job._id} delay={index * 50}>
                                <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-indigo-300 bg-white/80 backdrop-blur-sm">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <CardTitle className="text-2xl">{job.title}</CardTitle>
                                                    <Badge className={`${getStatusColor(job.status)} border`}>
                                                        {getStatusLabel(job.status)}
                                                    </Badge>
                                                </div>
                                                <CardDescription className="text-base">
                                                    Posted {formatDateTime(job.createdAt)} • Category: {job.category}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-base mb-4 line-clamp-2 text-gray-700">{job.description}</p>

                                        {/* Skills */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {job.skills && job.skills.length > 0 ? (
                                                job.skills.slice(0, 5).map((skill, idx) => (
                                                    <Badge key={idx} variant="secondary" className="bg-purple-100 text-purple-700">
                                                        {skill}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <span className="text-sm text-muted-foreground">No skills listed</span>
                                            )}
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center justify-between pt-4 border-t">
                                            <div className="flex items-center gap-6 text-sm">
                                                {job.budget && (
                                                    <span className="flex items-center gap-1 font-semibold text-green-600">
                                                        <IndianRupee className="h-4 w-4" />
                                                        {formatCurrency(job.budget.min)} - {formatCurrency(job.budget.max)}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1 text-muted-foreground">
                                                    <Users className="h-4 w-4" />
                                                    {job.proposalCount || 0} Proposals
                                                </span>
                                                <span className="flex items-center gap-1 text-muted-foreground">
                                                    <Eye className="h-4 w-4" />
                                                    {job.viewCount || 0} Views
                                                </span>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                <Link to={`/jobs/${job._id}`}>
                                                    <Button size="sm" variant="outline" className="hover:bg-indigo-50">
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        View
                                                    </Button>
                                                </Link>
                                                {job.status === 'open' && (
                                                    <>
                                                        <Link to={`/jobs/${job._id}/edit`}>
                                                            <Button size="sm" variant="outline" className="hover:bg-blue-50">
                                                                <Edit className="h-4 w-4 mr-1" />
                                                                Edit
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="hover:bg-red-50 hover:text-red-600"
                                                            onClick={() => handleDelete(job._id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-1" />
                                                            Delete
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </ScrollReveal>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
