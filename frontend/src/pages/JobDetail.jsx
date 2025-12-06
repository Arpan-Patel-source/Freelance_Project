import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import useJobStore from '../store/useJobStore';
import useAuthStore from '../store/useAuthStore';
import api from '../lib/api';
import { Clock, IndianRupee, Calendar, Star, Briefcase } from 'lucide-react';
import { formatCurrency, formatDate, getInitials } from '../lib/utils';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentJob, fetchJobById, loading } = useJobStore();
  const { user, isAuthenticated } = useAuthStore();
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposal, setProposal] = useState({
    coverLetter: '',
    bidAmount: '',
    deliveryTime: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchJobById(id);
  }, [id]);

  // Validation functions
  const validateCoverLetter = (value) => {
    const hasLetter = /[A-Za-z]/.test(value);
    const onlyNumbers = /^[0-9\s]+$/.test(value);

    if (!value) return 'Cover letter is required';
    if (!hasLetter || onlyNumbers) {
      return 'Cover letter must contain meaningful text, not just numbers';
    }
    if (value.length < 15) {
      return 'Cover letter must be at least 15 characters';
    }
    return '';
  };

  const validateBidAmount = (value) => {
    const amount = Number(value);
    const minBudget = currentJob?.budget?.min || 0;

    if (!value) return 'Bid amount is required';
    if (amount < minBudget) {
      return `Bid amount must be at least ₹${minBudget} (job's minimum budget)`;
    }
    return '';
  };

  const validateDeliveryTime = (value) => {
    const days = Number(value);

    if (!value) return 'Delivery time is required';
    if (days < 1) {
      return 'Delivery time must be at least 1 day';
    }
    return '';
  };

  const handleSubmitProposal = async (e) => {
    e.preventDefault();

    // Validate all fields
    const validationErrors = {
      coverLetter: validateCoverLetter(proposal.coverLetter),
      bidAmount: validateBidAmount(proposal.bidAmount),
      deliveryTime: validateDeliveryTime(proposal.deliveryTime),
    };

    setErrors(validationErrors);

    // Check if there are any errors
    const hasErrors = Object.values(validationErrors).some(error => error !== '');
    if (hasErrors) {
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/proposals', {
        jobId: id,
        ...proposal,
      });
      alert('Proposal submitted successfully!');
      setShowProposalForm(false);
      fetchJobById(id);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit proposal');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !currentJob) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const hasApplied = currentJob.proposals?.some(
    (p) => p.freelancer?._id === user?._id
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start mb-4">
                <Badge>{currentJob.category}</Badge>
                <Badge variant="outline">{currentJob.status}</Badge>
              </div>
              <CardTitle className="text-3xl">{currentJob.title}</CardTitle>
              <CardDescription>
                Posted {formatDate(currentJob.createdAt)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {currentJob.description}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {currentJob.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-semibold">
                      {formatCurrency(currentJob.budget.min)} -{' '}
                      {formatCurrency(currentJob.budget.max)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold">{currentJob.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Experience Level</p>
                    <p className="font-semibold capitalize">{currentJob.experienceLevel}</p>
                  </div>
                </div>
                {currentJob.deadline && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Deadline</p>
                      <p className="font-semibold">{formatDate(currentJob.deadline)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Client - View Proposals Button */}
          {(() => {
            console.log('Proposals button check:', {
              isAuthenticated,
              userRole: user?.role,
              userId: user?._id,
              clientId: currentJob.client?._id,
              match: user?._id === currentJob.client?._id
            });
            return null;
          })()}
          {isAuthenticated && user?.role === 'client' && user?._id === currentJob.client?._id && (
            <Card>
              <CardHeader>
                <CardTitle>Manage Proposals</CardTitle>
                <CardDescription>
                  {currentJob.proposals?.length || 0} proposal(s) received
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate(`/jobs/${id}/proposals`)}>
                  View All Proposals
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Proposal Form */}
          {isAuthenticated && user?.role === 'freelancer' && currentJob.status === 'open' && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {hasApplied ? 'You have already applied' : 'Submit a Proposal'}
                </CardTitle>
              </CardHeader>
              {!hasApplied && (
                <CardContent>
                  {!showProposalForm ? (
                    <Button onClick={() => setShowProposalForm(true)}>
                      Apply for this Job
                    </Button>
                  ) : (
                    <form onSubmit={handleSubmitProposal} className="space-y-4">
                      <div>
                        <Label htmlFor="coverLetter">Cover Letter</Label>
                        <Textarea
                          id="coverLetter"
                          placeholder="Explain why you're the best fit for this job..."
                          rows={6}
                          value={proposal.coverLetter}
                          onChange={(e) => {
                            const value = e.target.value;
                            setProposal({ ...proposal, coverLetter: value });
                            setErrors({ ...errors, coverLetter: validateCoverLetter(value) });
                          }}
                          required
                        />
                        {errors.coverLetter && (
                          <p className="text-sm text-red-600 mt-1">{errors.coverLetter}</p>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="bidAmount">Bid Amount (₹)</Label>
                          <Input
                            id="bidAmount"
                            type="number"
                            placeholder="1000"
                            min={currentJob?.budget?.min || 0}
                            value={proposal.bidAmount}
                            onChange={(e) => {
                              const value = e.target.value;
                              setProposal({ ...proposal, bidAmount: value });
                              setErrors({ ...errors, bidAmount: validateBidAmount(value) });
                            }}
                            required
                          />
                          {errors.bidAmount && (
                            <p className="text-sm text-red-600 mt-1">{errors.bidAmount}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Min: ₹{currentJob?.budget?.min || 0}
                          </p>
                        </div>
                        <div>
                          <Label htmlFor="deliveryTime">Delivery Time (days)</Label>
                          <Input
                            id="deliveryTime"
                            type="number"
                            placeholder="7"
                            min="1"
                            value={proposal.deliveryTime}
                            onChange={(e) => {
                              const value = e.target.value;
                              setProposal({ ...proposal, deliveryTime: value });
                              setErrors({ ...errors, deliveryTime: validateDeliveryTime(value) });
                            }}
                            required
                          />
                          {errors.deliveryTime && (
                            <p className="text-sm text-red-600 mt-1">{errors.deliveryTime}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" disabled={submitting}>
                          {submitting ? 'Submitting...' : 'Submit Proposal'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowProposalForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              )}
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About the Client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={currentJob.client?.avatar} />
                  <AvatarFallback>
                    {getInitials(currentJob.client?.name || 'Client')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{currentJob.client?.name}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>
                      {currentJob.client?.rating?.toFixed(1) || 'N/A'} (
                      {currentJob.client?.reviewCount || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Spent</span>
                  <span className="font-semibold">
                    {formatCurrency(currentJob.client?.totalSpent || 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Proposals</span>
                <span className="font-semibold">{currentJob.proposals?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Views</span>
                <span className="font-semibold">{currentJob.viewCount || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
