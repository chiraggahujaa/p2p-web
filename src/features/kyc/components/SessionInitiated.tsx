"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, ArrowLeft, Clock, Shield } from "lucide-react";

interface SessionInitiatedProps {
  redirectUrl: string;
  sessionId: string;
  onRedirect: () => void;
  onCancel: () => void;
}

export function SessionInitiated({ 
  redirectUrl, 
  sessionId,
  onRedirect, 
  onCancel 
}: SessionInitiatedProps) {
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Success Alert */}
      <Alert className="border-green-200 bg-green-50">
        <Shield className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          DigiLocker verification session has been initiated successfully!
        </AlertDescription>
      </Alert>

      {/* Session Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6 space-y-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <ExternalLink className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-blue-900 mb-2">
              Ready to Verify with DigiLocker
            </h3>
            <p className="text-blue-700 mb-4">
              Click the button below to securely access your documents from DigiLocker.
              You&apos;ll be redirected to the official DigiLocker website.
            </p>
          </div>

          {/* Session Timer */}
          <div className="flex items-center justify-center space-x-2 text-blue-700">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">
              Session expires in: {formatTime(timeLeft)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">What happens next:</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">1</span>
            <span>You&apos;ll be redirected to the official DigiLocker website</span>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">2</span>
            <span>Log in to your DigiLocker account (or create one if needed)</span>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">3</span>
            <span>Give consent to share your selected documents</span>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">4</span>
            <span>You&apos;ll be automatically redirected back here once complete</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onRedirect}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Continue to DigiLocker
        </Button>
      </div>

      <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>

      {/* Security Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Notice:</strong> Always verify that you&apos;re on the official DigiLocker website 
          (digilocker.gov.in) before entering your credentials. We&apos;ll never ask for your DigiLocker 
          password directly.
        </AlertDescription>
      </Alert>

      {/* Session Details */}
      <details className="text-sm text-gray-500">
        <summary className="cursor-pointer hover:text-gray-700">
          Technical Details
        </summary>
        <div className="mt-2 p-3 bg-gray-50 rounded-md">
          <div><strong>Session ID:</strong> {sessionId}</div>
          <div><strong>Redirect URL:</strong> {redirectUrl}</div>
        </div>
      </details>
    </div>
  );
}