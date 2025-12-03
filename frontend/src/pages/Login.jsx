import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import useAuthStore from '../store/useAuthStore';
import { Briefcase, AlertCircle, Sparkles, LogIn, RefreshCw } from 'lucide-react';
import { checkBackendConnection } from '../utils/checkBackend';
import GoogleOAuthButton from '../components/GoogleOAuthButton';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [backendStatus, setBackendStatus] = useState(null);
  const [shake, setShake] = useState(false);
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Check backend connection on component mount
    checkBackendConnection().then(status => {
      setBackendStatus(status);
      if (!status.connected) {
        console.error('⚠️ Backend is not reachable!');
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check backend before attempting login
    const status = await checkBackendConnection();
    if (!status.connected) {
      setBackendStatus(status);
      return;
    }

    try {
      console.log('Attempting login with:', { email });
      await login(email, password);
      console.log('Login successful, navigating to dashboard...');
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);

      // Trigger shake animation on error
      setShake(true);
      setTimeout(() => setShake(false), 500);

      // Check if error is due to unverified email
      if (err.message && err.message.includes('verify your email')) {
        // Redirect to verification page
        navigate(`/verify-email?email=${encodeURIComponent(email)}`);
      }

      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <Card className={`w-full max-w-md relative z-10 border-2 shadow-2xl animate-scale-in ${shake ? 'animate-shake' : ''}`}>
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-800 to-pink-600 rounded-xl">
              <Briefcase className="h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold text-gradient">Welcome Back</CardTitle>
          <CardDescription className="text-base">Login to your Worksera account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {backendStatus && !backendStatus.connected && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm p-3 rounded-md flex items-start gap-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Backend Server Not Running</p>
                  <p className="mt-1">Please start the backend server:</p>
                  <code className="block mt-1 bg-yellow-100 px-2 py-1 rounded text-xs">
                    cd backend && npm run dev
                  </code>
                </div>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 text-sm p-3 rounded-lg flex items-start gap-2 animate-bounce-in">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p className="font-medium">{error}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                pattern="[a-zA-Z0-9._%+-]+@(gmail|outlook|rediffmail|acropolis)\.[a-zA-Z]{2,}"
                title="Please enter a valid email from Gmail, Outlook, Rediffmail, or Acropolis"
                className="border-2 focus:border-indigo-400 transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-semibold">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-2 focus:border-indigo-400 transition-all"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-800 to-pink-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-lg py-6" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  Login
                </span>
              )}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <GoogleOAuthButton />

          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
