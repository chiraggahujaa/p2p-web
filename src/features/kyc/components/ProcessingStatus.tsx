"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SessionStatus, SESSION_STATUS_MESSAGES } from "../types/digilockerTypes";
import { 
  Loader2, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink,
  Download
} from "lucide-react";

interface ProcessingStatusProps {
  status: SessionStatus;
  sessionId: string;
  isProcessing: boolean;
  onCancel: () => void;
}

export function ProcessingStatus({ 
  status, 
  sessionId,
  isProcessing,
  onCancel 
}: ProcessingStatusProps) {
  const [dots, setDots] = useState('');

  // Animate loading dots
  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isProcessing]);

  const getStatusIcon = (status: SessionStatus) => {
    switch (status) {
      case 'initiated':
        return <Clock className="h-8 w-8 text-blue-500" />;
      case 'redirected':
        return <ExternalLink className="h-8 w-8 text-blue-500" />;
      case 'authorized':
        return <Download className="h-8 w-8 text-green-500" />;
      case 'documents_fetched':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'expired':
      case 'failed':
        return <AlertTriangle className="h-8 w-8 text-red-500" />;
      default:
        return <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />;
    }
  };

  const getStatusColor = (status: SessionStatus) => {
    switch (status) {
      case 'authorized':
      case 'documents_fetched':
        return 'border-green-200 bg-green-50';
      case 'expired':
      case 'failed':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getProgressPercentage = (status: SessionStatus) => {
    switch (status) {
      case 'initiated':
        return 25;
      case 'redirected':
        return 50;
      case 'authorized':
        return 75;
      case 'documents_fetched':
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card className={getStatusColor(status)}>
        <CardContent className="p-6 text-center space-y-4">
          {/* Status Icon */}
          <div className="flex justify-center">
            {isProcessing ? (
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            ) : (
              getStatusIcon(status)
            )}
          </div>

          {/* Status Message */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isProcessing ? (
                <>Processing{dots}</>
              ) : (
                status === 'redirected' ? 'Waiting for DigiLocker Authorization' :
                status === 'authorized' ? 'Fetching Documents' :
                SESSION_STATUS_MESSAGES[status] || 'Processing...'
              )}
            </h3>
            
            {status === 'redirected' && (
              <p className="text-gray-600">
                Please complete the verification on DigiLocker and return to this page.
              </p>
            )}
            
            {status === 'authorized' && (
              <p className="text-green-700">
                Authorization successful! Retrieving your documents...
              </p>
            )}

            {isProcessing && (
              <p className="text-blue-600">
                This may take a few moments. Please don&apos;t close this window.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progress</span>
          <span>{getProgressPercentage(status)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${getProgressPercentage(status)}%` }}
          />
        </div>
      </div>

      {/* Status Steps */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Verification Steps:</h4>
        <div className="space-y-2">
          {[
            { status: 'initiated', label: 'Session Created' },
            { status: 'redirected', label: 'Redirected to DigiLocker' },
            { status: 'authorized', label: 'User Authorization' },
            { status: 'documents_fetched', label: 'Documents Retrieved' }
          ].map((step, index) => {
            const isCompleted = getProgressPercentage(status) > index * 25;
            const isCurrent = status === step.status;
            
            return (
              <div key={step.status} className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  isCompleted 
                    ? 'bg-green-500' 
                    : isCurrent 
                      ? 'bg-blue-500 animate-pulse' 
                      : 'bg-gray-300'
                }`}>
                  {isCompleted && (
                    <CheckCircle className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className={`text-sm ${
                  isCompleted 
                    ? 'text-green-700 font-medium' 
                    : isCurrent 
                      ? 'text-blue-700 font-medium' 
                      : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Information */}
      {status === 'redirected' && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            This page will automatically update when you complete the verification on DigiLocker.
            If you encounter any issues, you can cancel and try again.
          </AlertDescription>
        </Alert>
      )}

      {status === 'authorized' && (
        <Alert className="border-green-200 bg-green-50">
          <Download className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Great! You&apos;ve successfully authorized document access. 
            We&apos;re now securely retrieving your documents from DigiLocker.
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
        >
          Cancel Verification
        </Button>
      </div>

      {/* Technical Details */}
      <details className="text-sm text-gray-500">
        <summary className="cursor-pointer hover:text-gray-700">
          Session Details
        </summary>
        <div className="mt-2 p-3 bg-gray-50 rounded-md">
          <div><strong>Session ID:</strong> {sessionId}</div>
          <div><strong>Current Status:</strong> {status}</div>
          <div><strong>Last Updated:</strong> {new Date().toLocaleString()}</div>
        </div>
      </details>
    </div>
  );
}