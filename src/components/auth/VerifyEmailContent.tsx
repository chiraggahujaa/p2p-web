'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { CheckCircle, XCircle } from 'lucide-react';

export default function VerifyEmailContent() {
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verifyEmail } = useAuth();

  const token = searchParams.get('token');
  const type = searchParams.get('type') as 'signup' | 'email' | 'recovery' | null;
  const email = searchParams.get('email');

  useEffect(() => {
    const verifyEmailToken = async () => {
      if (!token || !type) {
        setVerificationStatus('error');
        setErrorMessage('Invalid verification link. Missing token or type.');
        return;
      }

      try {
        await verifyEmail(token, type, email || undefined);
        setVerificationStatus('success');
      } catch (err: unknown) {
        const anyErr = err as { response?: { data?: { error?: string } } };
        setVerificationStatus('error');
        setErrorMessage(anyErr?.response?.data?.error || 'Email verification failed');
      }
    };

    verifyEmailToken();
  }, [token, type, email, verifyEmail]);

  const handleRedirect = () => {
    if (verificationStatus === 'success') {
      router.push('/');
    } else {
      router.push('/signin');
    }
  };

  if (verificationStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <LoadingSpinner size={32} />
            <p className="mt-4 text-center text-gray-600">Verifying your email...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {verificationStatus === 'success' ? (
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          ) : (
            <XCircle className="mx-auto h-12 w-12 text-red-500" />
          )}
          <CardTitle>
            {verificationStatus === 'success' ? 'Email Verified!' : 'Verification Failed'}
          </CardTitle>
          <CardDescription>
            {verificationStatus === 'success' 
              ? 'Your email has been successfully verified. You can now access your account.'
              : 'We encountered an issue verifying your email.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {verificationStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          )}
          <Button onClick={handleRedirect} className="w-full">
            {verificationStatus === 'success' ? 'Go to Dashboard' : 'Back to Sign In'}
          </Button>
          {verificationStatus === 'error' && (
            <div className="text-center">
              <p className="text-sm text-gray-600">Need help? Contact support or try signing in again.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


