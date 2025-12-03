import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Briefcase, Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../lib/api';
import useAuthStore from '../store/useAuthStore';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setToken, setUser } = useAuthStore();

    const [email, setEmail] = useState(searchParams.get('email') || '');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);

    useEffect(() => {
        let timer;
        if (resendCooldown > 0) {
            timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const { data } = await api.post('/auth/verify-email', { email, otp });
            setSuccess('Email verified successfully! Logging you in...');

            // Store token and user data
            setToken(data.token);
            setUser(data);

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (resendCooldown > 0) return;

        setResendLoading(true);
        setError('');
        setSuccess('');

        try {
            await api.post('/auth/resend-otp', { email });
            setSuccess('New OTP has been sent to your email!');
            setResendCooldown(60); // 60 second cooldown
            setOtp(''); // Clear OTP input
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <Mail className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
                    <CardDescription>
                        We've sent a 6-digit OTP to your email address
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleVerify} className="space-y-4">
                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-800 text-sm p-3 rounded-md flex items-start gap-2">
                                <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                <span>{success}</span>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-800 text-sm p-3 rounded-md flex items-start gap-2">
                                <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled
                                className="bg-gray-50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="otp">Enter OTP</Label>
                            <Input
                                id="otp"
                                type="text"
                                placeholder="000000"
                                value={otp}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                    setOtp(value);
                                }}
                                maxLength={6}
                                pattern="\d{6}"
                                required
                                className="text-center text-2xl tracking-widest font-semibold"
                            />
                            <p className="text-xs text-muted-foreground text-center">
                                OTP expires in 10 minutes
                            </p>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading || otp.length !== 6}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                'Verify Email'
                            )}
                        </Button>
                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-muted-foreground mb-2">
                            Didn't receive the OTP?
                        </p>
                        <Button
                            variant="outline"
                            onClick={handleResendOTP}
                            disabled={resendLoading || resendCooldown > 0}
                            className="w-full"
                        >
                            {resendLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : resendCooldown > 0 ? (
                                `Resend OTP in ${resendCooldown}s`
                            ) : (
                                'Resend OTP'
                            )}
                        </Button>
                    </div>

                    <div className="mt-6 text-center text-sm">
                        <Link to="/login" className="text-primary hover:underline">
                            Back to Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
