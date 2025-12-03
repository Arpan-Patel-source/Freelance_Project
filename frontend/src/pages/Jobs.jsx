import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import useJobStore from '../store/useJobStore';
import { Search, MapPin, Clock, DollarSign, Sparkles } from 'lucide-react';
import { formatCurrency, formatDate } from '../lib/utils';
import { SkeletonJobCard } from '../components/LoadingSkeleton';
import ScrollReveal from '../components/ScrollReveal';

export default function Jobs() {
  const { jobs = [], fetchJobs, loading, error } = useJobStore();
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    budgetMin: '',
    budgetMax: '',
  });

  useEffect(() => {
    console.log('Jobs component mounted');
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-search effect with debouncing
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const queryFilters = {};
      if (filters.search) queryFilters.search = filters.search;
      if (filters.category) queryFilters.category = filters.category;
      if (filters.budgetMin) queryFilters.budgetMin = filters.budgetMin;
      if (filters.budgetMax) queryFilters.budgetMax = filters.budgetMax;
      
      // Fetch jobs with current filters (or all jobs if no filters)
      fetchJobs(queryFilters);
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.category, filters.budgetMin, filters.budgetMax]);

  console.log('Jobs render:', { jobsCount: jobs?.length, loading, error });

  const handleSearch = () => {
    const queryFilters = {};
    if (filters.search) queryFilters.search = filters.search;
    if (filters.category) queryFilters.category = filters.category;
    if (filters.budgetMin) queryFilters.budgetMin = filters.budgetMin;
    if (filters.budgetMax) queryFilters.budgetMax = filters.budgetMax;
    fetchJobs(queryFilters);
  };

  const categories = [
    'Web Development',
    'Mobile Development',
    'Design',
    'Writing',
    'Marketing',
    'Data Science',
    'Other',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 rounded-full px-4 py-2 mb-4 animate-bounce-in">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-semibold">FIND YOUR PERFECT MATCH</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 text-gradient">Browse Amazing Jobs</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover thousands of opportunities from top clients worldwide
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-2 hover:border-purple-200 transition-all duration-300 shadow-lg bg-white backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search jobs by title, skills, or description..."
                    className="pl-10 border-2 focus:border-indigo-400 transition-all"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value === 'all' ? '' : value })}>
                <SelectTrigger className="border-2 focus:border-indigo-400">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleSearch} className="bg-gradient-to-r from-purple-800 to-pink-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Jobs List */}
        {error ? (
          <div className="text-center py-12">
            <p className="text-destructive text-lg font-semibold">{error}</p>
            <Button onClick={() => fetchJobs()} className="mt-4 bg-gradient-to-r from-purple-800 to-pink-600">Try Again</Button>
          </div>
        ) : loading ? (
          <div className="grid gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonJobCard key={i} />
            ))}
          </div>
        ) : !jobs || jobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex p-6 bg-gray-100 rounded-full mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <p className="text-muted-foreground text-xl">No jobs found</p>
            <p className="text-sm text-muted-foreground mt-2">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job, index) => (
              <ScrollReveal key={job._id} delay={index * 50}>
                <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-indigo-300 bg-white/80 backdrop-blur-sm hover-lift glow-hover">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <Link to={`/jobs/${job._id}`}>
                          <CardTitle className="text-2xl hover:text-indigo-600 cursor-pointer transition-colors group-hover:text-gradient">
                            {job.title}
                          </CardTitle>
                        </Link>
                        <CardDescription className="mt-2 text-base">
                          Posted by <span className="font-semibold">{job.client?.name || 'Unknown'}</span> • {formatDate(job.createdAt)}
                        </CardDescription>
                      </div>
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-500 text-white border-0 text-sm px-3 py-1">
                        {job.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base mb-4 line-clamp-2 text-gray-700">{job.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills && job.skills.length > 0 ? (
                        job.skills.slice(0, 5).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No skills listed</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm pt-4 border-t">
                      <div className="flex items-center gap-4">
                        {job.budget && (
                          <span className="flex items-center gap-1 font-semibold text-green-600">
                            <DollarSign className="h-4 w-4" />
                            {formatCurrency(job.budget.min)} - {formatCurrency(job.budget.max)}
                          </span>
                        )}
                        {job.duration && (
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {job.duration}
                          </span>
                        )}
                      </div>
                      <Link to={`/jobs/${job._id}`}>
                        <Button size="sm" className="bg-gradient-to-r from-purple-800 to-pink-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 group-hover:scale-105">
                          View Details
                        </Button>
                      </Link>
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
