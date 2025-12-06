import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import api from '../lib/api';
import { Star, IndianRupee, Clock, Briefcase, ArrowLeft } from 'lucide-react';
import { formatCurrency, formatDate, getInitials } from '../lib/utils';

export default function JobProposals() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(null);

  useEffect(() => {
    fetchJobAndProposals();
  }, [id]);

  const fetchJobAndProposals = async () => {
    try {
      setLoading(true);
      const [jobRes, proposalsRes] = await Promise.all([
        api.get(`/jobs/${id}`),
        api.get(`/proposals/job/${id}`)
      ]);
      setJob(jobRes.data);
      setProposals(proposalsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert(error.response?.data?.message || 'Failed to load proposals');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptProposal = async (proposalId) => {
    if (!confirm('Are you sure you want to accept this proposal? This will reject all other proposals and create a contract.')) {
      return;
    }

    try {
      setAccepting(proposalId);
      const { data } = await api.put(`/proposals/${proposalId}/accept`);
      alert('Proposal accepted! Contract created successfully.');
      navigate(`/contracts/${data.contract._id}`);
    } catch (error) {
      console.error('Error accepting proposal:', error);
      alert(error.response?.data?.message || 'Failed to accept proposal');
    } finally {
      setAccepting(null);
    }
  };

  const handleRejectProposal = async (proposalId) => {
    if (!confirm('Are you sure you want to reject this proposal?')) {
      return;
    }

    try {
      await api.put(`/proposals/${proposalId}/reject`);
      alert('Proposal rejected');
      fetchJobAndProposals();
    } catch (error) {
      console.error('Error rejecting proposal:', error);
      alert(error.response?.data?.message || 'Failed to reject proposal');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Loading proposals...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-destructive">Job not found</p>
      </div>
    );
  }

  const pendingProposals = proposals.filter(p => p.status === 'pending');
  const acceptedProposal = proposals.find(p => p.status === 'accepted');
  const rejectedProposals = proposals.filter(p => p.status === 'rejected');

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(`/jobs/${id}`)}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Job
      </Button>

      {/* Job Summary */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{job.title}</CardTitle>
              <CardDescription>Posted {formatDate(job.createdAt)}</CardDescription>
            </div>
            <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
              {job.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
              <span>{formatCurrency(job.budget.min)} - {formatCurrency(job.budget.max)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{job.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span className="capitalize">{job.experienceLevel}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proposals Summary */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Proposals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proposals.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingProposals.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{acceptedProposal ? 1 : 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Accepted Proposal */}
      {acceptedProposal && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Accepted Proposal</h2>
          <ProposalCard
            proposal={acceptedProposal}
            onAccept={handleAcceptProposal}
            onReject={handleRejectProposal}
            accepting={accepting}
            showActions={false}
          />
        </div>
      )}

      {/* Pending Proposals */}
      {pendingProposals.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Pending Proposals ({pendingProposals.length})</h2>
          <div className="space-y-4">
            {pendingProposals.map((proposal) => (
              <ProposalCard
                key={proposal._id}
                proposal={proposal}
                onAccept={handleAcceptProposal}
                onReject={handleRejectProposal}
                accepting={accepting}
                showActions={job.status === 'open'}
              />
            ))}
          </div>
        </div>
      )}

      {/* Rejected Proposals */}
      {rejectedProposals.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Rejected Proposals ({rejectedProposals.length})</h2>
          <div className="space-y-4">
            {rejectedProposals.map((proposal) => (
              <ProposalCard
                key={proposal._id}
                proposal={proposal}
                onAccept={handleAcceptProposal}
                onReject={handleRejectProposal}
                accepting={accepting}
                showActions={false}
              />
            ))}
          </div>
        </div>
      )}

      {proposals.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No proposals received yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ProposalCard({ proposal, onAccept, onReject, accepting, showActions }) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    withdrawn: 'bg-gray-100 text-gray-800',
  };

  return (
    <Card className={proposal.status === 'accepted' ? 'border-green-500 border-2' : ''}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={proposal.freelancer?.avatar} />
              <AvatarFallback>
                {getInitials(proposal.freelancer?.name || 'Freelancer')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{proposal.freelancer?.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>
                    {proposal.freelancer?.rating?.toFixed(1) || 'N/A'} (
                    {proposal.freelancer?.reviewCount || 0} reviews)
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">
                  {proposal.freelancer?.completedJobs || 0} jobs completed
                </span>
              </div>
            </div>
          </div>
          <Badge className={statusColors[proposal.status]}>
            {proposal.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Skills */}
        {proposal.freelancer?.skills && proposal.freelancer.skills.length > 0 && (
          <div>
            <p className="text-sm font-semibold mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {proposal.freelancer.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Cover Letter */}
        <div>
          <p className="text-sm font-semibold mb-2">Cover Letter</p>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {proposal.coverLetter}
          </p>
        </div>

        <Separator />

        {/* Proposal Details */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Bid Amount</p>
            <p className="text-lg font-bold text-green-600">
              {formatCurrency(proposal.bidAmount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Delivery Time</p>
            <p className="text-lg font-semibold">{proposal.deliveryTime} days</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Submitted</p>
            <p className="text-lg font-semibold">{formatDate(proposal.createdAt)}</p>
          </div>
        </div>

        {/* Actions */}
        {showActions && proposal.status === 'pending' && (
          <div className="flex gap-2 pt-4">
            <Button
              onClick={() => onAccept(proposal._id)}
              disabled={accepting !== null}
              className="flex-1"
            >
              {accepting === proposal._id ? 'Accepting...' : 'Accept & Hire'}
            </Button>
            <Button
              variant="outline"
              onClick={() => onReject(proposal._id)}
              disabled={accepting !== null}
              className="flex-1"
            >
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
