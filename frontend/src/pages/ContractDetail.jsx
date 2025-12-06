import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import useAuthStore from '../store/useAuthStore';
import api from '../lib/api';
import { formatCurrency, formatDate, getInitials } from '../lib/utils';
import {
  ArrowLeft,
  IndianRupee,
  Calendar,
  Briefcase,
  Upload,
  CheckCircle,
  XCircle,
  FileText,
  Star,
  MessageSquare
} from 'lucide-react';

export default function ContractDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuthStore();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeliverableForm, setShowDeliverableForm] = useState(false);
  const [deliverable, setDeliverable] = useState({ name: '', url: '' });
  const [submitting, setSubmitting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [review, setReview] = useState({
    rating: 5,
    comment: '',
    communication: 5,
    quality: 5,
    professionalism: 5
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    fetchContract();
  }, [id]);

  const fetchContract = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/contracts/${id}`);
      setContract(data);

      // Check if user has already reviewed
      if (data.status === 'completed') {
        checkIfReviewed(data);
      }
    } catch (error) {
      console.error('Failed to fetch contract:', error);
      alert(error.response?.data?.message || 'Failed to load contract');
    } finally {
      setLoading(false);
    }
  };

  const checkIfReviewed = async (contractData) => {
    try {
      if (!contractData?.client?._id || !contractData?.freelancer?._id || !user?._id) {
        return;
      }

      const revieweeId = user._id === contractData.client._id
        ? contractData.freelancer._id
        : contractData.client._id;

      if (!revieweeId) return;

      const { data } = await api.get(`/reviews/user/${revieweeId}`);
      const existingReview = data.find(r => r.contract === id && r.reviewer === user._id);
      setHasReviewed(!!existingReview);
    } catch (error) {
      console.error('Failed to check reviews:', error);
    }
  };

  const handleSubmitDeliverable = async (e) => {
    e.preventDefault();
    if (!deliverable.name || !deliverable.url) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      await api.post(`/contracts/${id}/deliverables`, deliverable);
      alert('Deliverable submitted successfully!');
      setShowDeliverableForm(false);
      setDeliverable({ name: '', url: '' });
      fetchContract();
    } catch (error) {
      console.error('Failed to submit deliverable:', error);
      alert(error.response?.data?.message || 'Failed to submit deliverable');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteContract = async () => {
    if (!confirm('Are you sure you want to mark this contract as completed? This will release the payment to the freelancer.')) {
      return;
    }

    try {
      setCompleting(true);
      await api.put(`/contracts/${id}/complete`);
      alert('Contract completed successfully! Payment has been released.');
      // Refresh user data to update stats
      await refreshUser();
      fetchContract();
    } catch (error) {
      console.error('Failed to complete contract:', error);
      alert(error.response?.data?.message || 'Failed to complete contract');
    } finally {
      setCompleting(false);
    }
  };

  const handleCancelContract = async () => {
    if (!confirm('Are you sure you want to cancel this contract? This action cannot be undone.')) {
      return;
    }

    try {
      await api.put(`/contracts/${id}/cancel`);
      alert('Contract cancelled');
      fetchContract();
    } catch (error) {
      console.error('Failed to cancel contract:', error);
      alert(error.response?.data?.message || 'Failed to cancel contract');
    }
  };

  const handleMessageUser = () => {
    if (!contract) return;

    const otherUserId = isClient ? contract.freelancer?._id : contract.client?._id;
    if (otherUserId) {
      navigate(`/messages?user=${otherUserId}`);
    } else {
      alert('Unable to start conversation. User information not available.');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!review.comment.trim()) {
      alert('Please write a review comment');
      return;
    }

    try {
      setSubmittingReview(true);
      const revieweeId = isClient ? contract.freelancer._id : contract.client._id;

      await api.post('/reviews', {
        contractId: id,
        revieweeId,
        rating: review.rating,
        comment: review.comment,
        skills: {
          communication: review.communication,
          quality: review.quality,
          professionalism: review.professionalism
        }
      });

      alert('Review submitted successfully!');
      setShowReviewForm(false);
      setHasReviewed(true);
      setReview({
        rating: 5,
        comment: '',
        communication: 5,
        quality: 5,
        professionalism: 5
      });
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Loading contract...</p>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-destructive">Contract not found</p>
      </div>
    );
  }

  const isClient = user?._id === contract?.client?._id;
  const isFreelancer = user?._id === contract?.freelancer?._id;
  const canComplete = isClient && contract?.status === 'active' && contract?.deliverables?.length > 0;
  const canSubmitDeliverable = isFreelancer && contract?.status === 'active';
  const canCancel = contract?.status === 'active';

  const statusColors = {
    active: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    disputed: 'bg-yellow-100 text-yellow-800',
  };

  const paymentStatusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    escrowed: 'bg-blue-100 text-blue-800',
    released: 'bg-green-100 text-green-800',
    refunded: 'bg-red-100 text-red-800',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate('/contracts')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Contracts
      </Button>

      {/* Contract Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{contract.job?.title}</CardTitle>
              <CardDescription>
                {contract.job?.category} • Started {formatDate(contract.startDate)}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge className={statusColors[contract.status]}>
                {contract.status}
              </Badge>
              <Badge className={paymentStatusColors[contract.paymentStatus]}>
                {contract.paymentStatus}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <IndianRupee className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold">{formatCurrency(contract.totalAmount)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="text-lg font-semibold">{formatDate(contract.startDate)}</p>
              </div>
            </div>
            {contract.completedAt && (
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-lg font-semibold">{formatDate(contract.completedAt)}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {contract.job?.description}
              </p>
            </CardContent>
          </Card>

          {/* Deliverables */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Deliverables ({contract.deliverables?.length || 0})</CardTitle>
                {canSubmitDeliverable && !showDeliverableForm && (
                  <Button onClick={() => setShowDeliverableForm(true)} size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Submit Deliverable
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Submit Form */}
              {showDeliverableForm && (
                <form onSubmit={handleSubmitDeliverable} className="space-y-4 p-4 border rounded-lg bg-muted/50">
                  <div>
                    <Label htmlFor="name">Deliverable Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Final Website Design"
                      value={deliverable.name}
                      onChange={(e) => setDeliverable({ ...deliverable, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="url">File URL / Link</Label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://drive.google.com/..."
                      value={deliverable.url}
                      onChange={(e) => setDeliverable({ ...deliverable, url: e.target.value })}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload your file to Google Drive, Dropbox, or similar and paste the link here
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={submitting}>
                      {submitting ? 'Submitting...' : 'Submit'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowDeliverableForm(false);
                        setDeliverable({ name: '', url: '' });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              {/* Deliverables List */}
              {contract.deliverables && contract.deliverables.length > 0 ? (
                <div className="space-y-3">
                  {contract.deliverables.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Uploaded {formatDate(item.uploadedAt)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(item.url, '_blank')}
                      >
                        View File
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No deliverables submitted yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          {contract.status === 'active' && (
            <Card>
              <CardHeader>
                <CardTitle>Contract Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {canComplete && (
                  <div className="flex items-start gap-3 p-4 border border-green-200 rounded-lg bg-green-50">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-green-900">Ready to Complete?</p>
                      <p className="text-sm text-green-700 mb-3">
                        Review the deliverables and mark this contract as completed. This will release the payment to the freelancer.
                      </p>
                      <Button
                        onClick={handleCompleteContract}
                        disabled={completing}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {completing ? 'Completing...' : 'Complete Contract & Release Payment'}
                      </Button>
                    </div>
                  </div>
                )}

                {canCancel && (
                  <div className="flex items-start gap-3 p-4 border border-red-200 rounded-lg bg-red-50">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-red-900">Cancel Contract</p>
                      <p className="text-sm text-red-700 mb-3">
                        Cancel this contract if there are issues. This action cannot be undone.
                      </p>
                      <Button
                        variant="destructive"
                        onClick={handleCancelContract}
                      >
                        Cancel Contract
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Review Section */}
          {contract.status === 'completed' && !hasReviewed && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Leave a Review</CardTitle>
                  {!showReviewForm && (
                    <Button onClick={() => setShowReviewForm(true)} size="sm">
                      <Star className="h-4 w-4 mr-2" />
                      Write Review
                    </Button>
                  )}
                </div>
                <CardDescription>
                  Share your experience working with {isClient ? contract.freelancer?.name : contract.client?.name}
                </CardDescription>
              </CardHeader>
              {showReviewForm && (
                <CardContent>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    {/* Overall Rating */}
                    <div>
                      <Label>Overall Rating</Label>
                      <div className="flex items-center gap-2 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReview({ ...review, rating: star })}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`h-8 w-8 ${star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                                }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-sm font-semibold">{review.rating}/5</span>
                      </div>
                    </div>

                    {/* Detailed Ratings */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label>Communication</Label>
                        <div className="flex items-center gap-1 mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReview({ ...review, communication: star })}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`h-5 w-5 ${star <= review.communication
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                  }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label>Quality</Label>
                        <div className="flex items-center gap-1 mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReview({ ...review, quality: star })}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`h-5 w-5 ${star <= review.quality
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                  }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label>Professionalism</Label>
                        <div className="flex items-center gap-1 mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReview({ ...review, professionalism: star })}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`h-5 w-5 ${star <= review.professionalism
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                  }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Comment */}
                    <div>
                      <Label htmlFor="comment">Your Review</Label>
                      <Textarea
                        id="comment"
                        placeholder="Share your experience working together..."
                        rows={5}
                        value={review.comment}
                        onChange={(e) => setReview({ ...review, comment: e.target.value })}
                        required
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" disabled={submittingReview}>
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowReviewForm(false);
                          setReview({
                            rating: 5,
                            comment: '',
                            communication: 5,
                            quality: 5,
                            professionalism: 5
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              )}
            </Card>
          )}

          {contract.status === 'completed' && hasReviewed && (
            <Card>
              <CardContent className="py-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <p className="font-semibold">You've already reviewed this contract</p>
                <p className="text-sm text-muted-foreground">Thank you for your feedback!</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle>Client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={contract.client?.avatar} />
                  <AvatarFallback>
                    {getInitials(contract.client?.name || 'Client')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{contract.client?.name}</p>
                  <p className="text-sm text-muted-foreground">{contract.client?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Freelancer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Freelancer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={contract.freelancer?.avatar} />
                  <AvatarFallback>
                    {getInitials(contract.freelancer?.name || 'Freelancer')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{contract.freelancer?.name}</p>
                  <p className="text-sm text-muted-foreground">{contract.freelancer?.email}</p>
                </div>
              </div>
              {contract.freelancer?.skills && contract.freelancer.skills.length > 0 && (
                <>
                  <Separator className="my-3" />
                  <div>
                    <p className="text-sm font-semibold mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {contract.freelancer.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Message Button */}
          <Card>
            <CardHeader>
              <CardTitle>Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleMessageUser}
                className="w-full"
                variant="outline"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Message {isClient ? contract.freelancer?.name : contract.client?.name}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Contract Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-semibold capitalize">{contract.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Status</span>
                <span className="font-semibold capitalize">{contract.paymentStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Deliverables</span>
                <span className="font-semibold">{contract.deliverables?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Milestones</span>
                <span className="font-semibold">{contract.milestones?.length || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
