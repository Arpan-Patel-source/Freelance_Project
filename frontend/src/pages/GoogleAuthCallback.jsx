import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Loader2 } from 'lucide-react';

export default function GoogleAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');

    console.log('🔐 Google Auth Callback - Token received:', !!token);

    if (token) {
      console.log('📝 Fetching user data with token...');

      // Fetch user data
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => {
          console.log('📡 User data response status:', res.status);
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(user => {
          console.log('✅ User data received:', { id: user._id, email: user.email, role: user.role });

          // Store everything in sessionStorage
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('user', JSON.stringify(user));

          // Update Zustand store
          setToken(token);
          setUser(user);

          console.log('✅ Auth state updated, redirecting to dashboard...');

          // Small delay to ensure state updates
          setTimeout(() => {
            navigate('/dashboard');
          }, 100);
        })
        .catch(err => {
          console.error('❌ Failed to fetch user:', err);
          alert('Authentication failed. Please try again.');
          navigate('/login');
        });
    } else {
      console.error('❌ No token found in URL');
      // No token, redirect to login
      navigate('/login');
    }
  }, [searchParams, navigate, setUser, setToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Completing Sign In</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    </div>
  );
}
