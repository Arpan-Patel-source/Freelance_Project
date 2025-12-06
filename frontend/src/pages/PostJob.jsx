import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { CheckCircle2 } from 'lucide-react';
import useJobStore from '../store/useJobStore';

export default function PostJob() {
  const navigate = useNavigate();
  const { createJob, loading } = useJobStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    skills: '',
    budgetMin: '',
    budgetMax: '',
    budgetType: 'fixed',
    duration: '',
    experienceLevel: 'intermediate',
    deadline: '',
  });

  const [errors, setErrors] = useState({});
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdJobId, setCreatedJobId] = useState(null);

  // Get today's date in YYYY-MM-DD format for min date validation
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Validation functions
  const validateTitle = (value) => {
    const pattern = /^[A-Za-z\s]+$/;
    if (!value) return 'Job title is required';
    if (!pattern.test(value)) {
      return 'Job title can only contain letters and spaces';
    }
    return '';
  };

  const validateDescription = (value) => {
    const hasLetter = /[A-Za-z]/.test(value);
    if (!value) return 'Description is required';
    if (!hasLetter) {
      return 'Description must contain at least some alphabetic characters';
    }
    return '';
  };

  const validateSkills = (value) => {
    const hasLetter = /[A-Za-z]/.test(value);
    if (!value) return 'Skills are required';
    if (!hasLetter) {
      return 'Skills must contain at least one letter';
    }
    return '';
  };

  const validateBudgetMin = (value) => {
    const num = Number(value);
    if (!value) return 'Minimum budget is required';
    if (num < 0) {
      return 'Budget cannot be negative';
    }
    return '';
  };

  const validateBudgetMax = (value, minValue) => {
    const num = Number(value);
    const min = Number(minValue);
    if (!value) return 'Maximum budget is required';
    if (num < 0) {
      return 'Budget cannot be negative';
    }
    if (minValue && num < min) {
      return 'Maximum budget must be greater than or equal to minimum budget';
    }
    return '';
  };

  const validateDeadline = (value) => {
    if (!value) return ''; // Deadline is optional
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return 'Deadline must be a future date';
    }
    return '';
  };

  // Handle input changes with validation
  const handleTitleChange = (e) => {
    const value = e.target.value;
    // Only allow letters and spaces in real-time
    if (value === '' || /^[A-Za-z\s]*$/.test(value)) {
      setFormData({ ...formData, title: value });
      const error = validateTitle(value);
      setErrors({ ...errors, title: error });
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    // Allow all characters (letters, numbers, symbols, etc.)
    setFormData({ ...formData, description: value });
    const error = validateDescription(value);
    setErrors({ ...errors, description: error });
  };

  const handleSkillsChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, skills: value });
    const error = validateSkills(value);
    setErrors({ ...errors, skills: error });
  };

  const handleBudgetMinChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, budgetMin: value });
    const error = validateBudgetMin(value);
    setErrors({
      ...errors,
      budgetMin: error,
      budgetMax: validateBudgetMax(formData.budgetMax, value)
    });
  };

  const handleBudgetMaxChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, budgetMax: value });
    const error = validateBudgetMax(value, formData.budgetMin);
    setErrors({ ...errors, budgetMax: error });
  };

  const handleDeadlineChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, deadline: value });
    const error = validateDeadline(value);
    setErrors({ ...errors, deadline: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const validationErrors = {
      title: validateTitle(formData.title),
      description: validateDescription(formData.description),
      skills: validateSkills(formData.skills),
      budgetMin: validateBudgetMin(formData.budgetMin),
      budgetMax: validateBudgetMax(formData.budgetMax, formData.budgetMin),
      deadline: validateDeadline(formData.deadline),
    };

    setErrors(validationErrors);

    // Check if there are any errors
    const hasErrors = Object.values(validationErrors).some(error => error !== '');
    if (hasErrors) {
      return;
    }

    try {
      const jobData = {
        ...formData,
        skills: formData.skills.split(',').map((s) => s.trim()),
        budget: {
          min: Number(formData.budgetMin),
          max: Number(formData.budgetMax),
        },
      };
      const job = await createJob(jobData);
      setCreatedJobId(job._id);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error(error);
    }
  };

  const categories = [
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Graphic Design',
    'Logo Design',
    'Illustration',
    'Video Editing',
    'Animation',
    'Voice Talent',
    'Music Production',
    'Content Writing',
    'Copywriting',
    'Technical Writing',
    'Translation',
    'SEO & Digital Marketing',
    'Social Media Marketing',
    'Email Marketing',
    'Data Science',
    'Machine Learning & AI',
    'Data Analysis',
    'Game Development',
    'Software Development',
    'DevOps & Cloud',
    'Cybersecurity',
    'Blockchain & Cryptocurrency',
    'Virtual Assistant',
    'Customer Support',
    'Accounting & Finance',
    'Legal Consulting',
    'Business Consulting',
    '3D Modeling',
    'Architecture & Interior Design',
    'Product Design',
    'Other',
  ];

  const durations = [
    'less than 1 week',
    '1-2 weeks',
    '2-4 weeks',
    '1-3 months',
    'more than 3 months',
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Post a New Job</CardTitle>
          <CardDescription>
            Fill in the details below to find the perfect freelancer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                placeholder="e.g. Build a responsive website"
                value={formData.title}
                onChange={handleTitleChange}
                required
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your project in detail..."
                rows={6}
                value={formData.description}
                onChange={handleDescriptionChange}
                required
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="experienceLevel">Experience Level</Label>
                <Select
                  value={formData.experienceLevel}
                  onValueChange={(value) => setFormData({ ...formData, experienceLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="skills">Required Skills (comma-separated)</Label>
              <Input
                id="skills"
                placeholder="React, Node.js, MongoDB"
                value={formData.skills}
                onChange={handleSkillsChange}
                required
              />
              {errors.skills && (
                <p className="text-sm text-red-600 mt-1">{errors.skills}</p>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="budgetMin">Min Budget (₹)</Label>
                <Input
                  id="budgetMin"
                  type="number"
                  placeholder="500"
                  min="1"
                  value={formData.budgetMin}
                  onChange={handleBudgetMinChange}
                  required
                />
                {errors.budgetMin && (
                  <p className="text-sm text-red-600 mt-1">{errors.budgetMin}</p>
                )}
              </div>
              <div>
                <Label htmlFor="budgetMax">Max Budget (₹)</Label>
                <Input
                  id="budgetMax"
                  type="number"
                  placeholder="2000"
                  min="0"
                  value={formData.budgetMax}
                  onChange={handleBudgetMaxChange}
                  required
                />
                {errors.budgetMax && (
                  <p className="text-sm text-red-600 mt-1">{errors.budgetMax}</p>
                )}
              </div>
              <div>
                <Label htmlFor="budgetType">Budget Type</Label>
                <Select
                  value={formData.budgetType}
                  onValueChange={(value) => setFormData({ ...formData, budgetType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Price</SelectItem>
                    <SelectItem value="hourly">Hourly Rate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Project Duration</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => setFormData({ ...formData, duration: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((dur) => (
                      <SelectItem key={dur} value={dur}>
                        {dur}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="deadline">Deadline (Optional)</Label>
                <Input
                  id="deadline"
                  type="date"
                  min={getTodayDate()}
                  value={formData.deadline}
                  onChange={handleDeadlineChange}
                />
                {errors.deadline && (
                  <p className="text-sm text-red-600 mt-1">{errors.deadline}</p>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Posting...' : 'Post Job'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <DialogTitle className="text-center">Job Posted Successfully!</DialogTitle>
            <DialogDescription className="text-center">
              Your job has been posted and is now live. Freelancers can start submitting proposals.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowSuccessDialog(false);
                navigate('/my-jobs');
              }}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setShowSuccessDialog(false);
                navigate(`/jobs/${createdJobId}`);
              }}
            >
              View Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
