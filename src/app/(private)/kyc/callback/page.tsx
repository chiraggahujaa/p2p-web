"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDigiLockerVerification } from '@/features/kyc/hooks/useDigiLockerVerification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';

export default function DigiLockerCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [callbackProcessed, setCallbackProcessed] = useState(false);

  const {
    handleCallback,
    currentStep,
    sessionStatus,
    isHandlingCallback,
    verifiedData,
  } = useDigiLockerVerification();

  useEffect(() => {
    const processCallback = async () => {
      if (callbackProcessed) return;

      const sessionId = searchParams.get('sessionId') || searchParams.get('state');
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (!sessionId) {
        setIsProcessing(false);
        return;
      }

      setCallbackProcessed(true);

      try {
        // Handle the callback
        await handleCallback({
          code: code || undefined,
          error: error || undefined,
        });
      } catch (error) {
        console.error('Callback processing error:', error);
      } finally {
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [searchParams, handleCallback, callbackProcessed]);

  // Auto-redirect to main KYC page after successful verification
  useEffect(() => {
    if (currentStep === 'success' && verifiedData) {
      const timer = setTimeout(() => {
        router.push('/kyc?success=true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, verifiedData, router]);

  const getStatusMessage = () => {
    if (searchParams.get('error')) {
      return {
        type: 'error',
        title: 'Authorization Failed',
        message: `DigiLocker authorization failed: ${searchParams.get('error')}`,
      };
    }

    if (isProcessing || isHandlingCallback) {
      return {
        type: 'processing',
        title: 'Processing DigiLocker Response',
        message: 'Please wait while we process your DigiLocker authorization...',
      };
    }

    if (currentStep === 'success') {
      return {
        type: 'success',
        title: 'Verification Successful!',
        message: 'Your KYC verification has been completed successfully. Redirecting you now...',
      };
    }

    if (currentStep === 'error' || sessionStatus === 'failed') {
      return {
        type: 'error',
        title: 'Verification Failed',
        message: 'There was an issue processing your DigiLocker verification.',
      };
    }

    if (sessionStatus === 'authorized') {
      return {
        type: 'authorized',
        title: 'Authorization Successful',
        message: 'Authorization successful! We are now fetching your documents...',
      };
    }

    return {
      type: 'unknown',
      title: 'Processing...',
      message: 'Please wait while we handle your request.',
    };
  };

  const status = getStatusMessage();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ExternalLink className="mr-2 h-5 w-5" />
            DigiLocker Callback
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Display */}
          <div className="text-center">
            {status.type === 'processing' && (
              <div className="space-y-4">
                <LoadingSpinner />
                <h3 className="text-xl font-semibold text-gray-900">{status.title}</h3>
                <p className="text-gray-600">{status.message}</p>
              </div>
            )}

            {status.type === 'success' && (
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-green-900">{status.title}</h3>
                <p className="text-green-700">{status.message}</p>
                <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
                  <LoadingSpinner />
                  <span>Redirecting to KYC page...</span>
                </div>
              </div>
            )}

            {status.type === 'authorized' && (
              <div className="space-y-4">
                <LoadingSpinner />
                <h3 className="text-xl font-semibold text-blue-900">{status.title}</h3>
                <p className="text-blue-700">{status.message}</p>
              </div>
            )}

            {status.type === 'error' && (
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
                  <AlertTriangle className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-red-900">{status.title}</h3>
                <p className="text-red-700">{status.message}</p>
              </div>
            )}

            {status.type === 'unknown' && (
              <div className="space-y-4">
                <LoadingSpinner />
                <h3 className="text-xl font-semibold text-gray-900">{status.title}</h3>
                <p className="text-gray-600">{status.message}</p>
              </div>
            )}
          </div>

          {/* Error Alert */}
          {status.type === 'error' && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                If this issue persists, please try starting a new verification session 
                or contact our support team for assistance.
              </AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {status.type === 'success' && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Your identity verification is now complete! You have full access to all platform features.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            {(status.type === 'error' || !isProcessing) && (
              <Button
                onClick={() => router.push('/kyc')}
                variant={status.type === 'error' ? 'default' : 'outline'}
              >
                {status.type === 'error' ? 'Try Again' : 'Return to KYC'}
              </Button>
            )}

            {status.type === 'success' && (
              <Button
                onClick={() => router.push('/dashboard')}
                variant="outline"
              >
                Go to Dashboard
              </Button>
            )}
          </div>

          {/* Debug Information (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="text-sm text-gray-500 border-t pt-4">
              <summary className="cursor-pointer hover:text-gray-700 mb-2">
                Debug Information
              </summary>
              <div className="bg-gray-50 p-3 rounded-md space-y-2">
                <div><strong>Session ID:</strong> {searchParams.get('sessionId') || searchParams.get('state') || 'N/A'}</div>
                <div><strong>Code:</strong> {searchParams.get('code') || 'N/A'}</div>
                <div><strong>Error:</strong> {searchParams.get('error') || 'None'}</div>
                <div><strong>Current Step:</strong> {currentStep}</div>
                <div><strong>Session Status:</strong> {sessionStatus}</div>
                <div><strong>Is Processing:</strong> {isProcessing.toString()}</div>
                <div><strong>Is Handling Callback:</strong> {isHandlingCallback.toString()}</div>
              </div>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
}