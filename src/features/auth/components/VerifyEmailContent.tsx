'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/stores/useAppStore';
import { authAPI } from '@/lib/api/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

// Helper function to parse URL fragments from Supabase
const parseUrlFragment = () => {
  if (typeof window === 'undefined') return null;
  
  const fragment = window.location.hash.substring(1);
  if (!fragment) return null;
  
  const params = new URLSearchParams(fragment);
  return {
    access_token: params.get('access_token'),
    refresh_token: params.get('refresh_token'),
    type: params.get('type'),
    expires_at: params.get('expires_at'),
    expires_in: params.get('expires_in'),
  };
};

export default function VerifyEmailContent() {
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { setUser } = useAppStore();
  const { setTokens } = useAppStore();

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        const fragmentParams = parseUrlFragment();
        
        if (!fragmentParams?.access_token || !fragmentParams?.type) {
          setVerificationStatus('error');
          setErrorMessage('Invalid verification link. Missing authentication tokens.');
          return;
        }

        if (fragmentParams.type === 'signup' && fragmentParams.access_token && fragmentParams.refresh_token) {
          setTokens(fragmentParams.access_token, fragmentParams.refresh_token);
          
          try {
            const profile = await authAPI.getProfile();
            if (profile?.success && profile?.data?.user) {
              const user = profile.data.user;
              setUser({
                id: user.id,
                email: user.email,
                name: user.name,
                emailConfirmedAt: user.emailConfirmedAt,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
              });
            }
          } catch (profileError) {
            console.warn('Could not fetch profile after verification:', profileError);
          }
          
          window.history.replaceState(null, '', window.location.pathname);
          
          setVerificationStatus('success');
          toast.success('Email verified successfully! You are now logged in.');
          
          // Automatically redirect to onboarding after a brief delay
          setTimeout(() => {
            router.push('/onboarding');
          }, 1500);
        } else {
          setVerificationStatus('error');
          setErrorMessage('Invalid verification type or missing tokens.');
        }
      } catch (error) {
        console.error('Email verification error:', error);
        setVerificationStatus('error');
        setErrorMessage('Email verification failed. Please try again.');
      }
    };

    handleEmailVerification();
  }, [setTokens, setUser]);

  const handleRedirect = () => {
    if (verificationStatus === 'success') {
      router.push('/onboarding');
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
            {verificationStatus === 'success' ? 'Complete Setup' : 'Back to Sign In'}
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


