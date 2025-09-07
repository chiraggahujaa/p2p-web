"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  HelpCircle,
  ExternalLink 
} from "lucide-react";

interface VerificationErrorProps {
  onRetry: () => void;
  onCancel: () => void;
  errorMessage?: string;
}

export function VerificationError({ 
  onRetry, 
  onCancel,
  errorMessage 
}: VerificationErrorProps) {
  
  const commonIssues = [
    {
      issue: "DigiLocker authentication failed",
      solution: "Ensure you're using the correct DigiLocker credentials"
    },
    {
      issue: "Session expired",
      solution: "Sessions expire after 1 hour for security. Please start a new verification"
    },
    {
      issue: "Documents not found",
      solution: "Make sure the requested documents are available in your DigiLocker account"
    },
    {
      issue: "Network connectivity issues",
      solution: "Check your internet connection and try again"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Error Header */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-900 mb-2">
            Verification Failed
          </h2>
          <p className="text-red-700">
            {errorMessage || "We encountered an issue while verifying your documents through DigiLocker."}
          </p>
        </CardContent>
      </Card>

      {/* Error Details */}
      <Alert className="border-amber-200 bg-amber-50">
        <HelpCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          Don&apos;t worry! This is usually a temporary issue. Most verification problems can be 
          resolved by trying again or checking the common solutions below.
        </AlertDescription>
      </Alert>

      {/* Common Issues & Solutions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <HelpCircle className="mr-2 h-5 w-5 text-blue-600" />
            Common Issues & Solutions
          </h3>
          
          <div className="space-y-4">
            {commonIssues.map((item, index) => (
              <div key={index} className="border-l-4 border-blue-200 pl-4">
                <h4 className="font-medium text-gray-900">{item.issue}</h4>
                <p className="text-sm text-gray-600 mt-1">{item.solution}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting Steps */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Troubleshooting Steps
          </h3>
          <ol className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">1</span>
              <span>Check that you have a valid DigiLocker account with the required documents</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">2</span>
              <span>Ensure your internet connection is stable</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">3</span>
              <span>Clear your browser cache and cookies</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">4</span>
              <span>Try using a different browser or device</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">5</span>
              <span>If the issue persists, contact our support team</span>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onRetry}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
        
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          <Home className="mr-2 h-4 w-4" />
          Return to Dashboard
        </Button>
      </div>

      {/* Support Links */}
      <Card className="border-gray-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              asChild
            >
              <a href="https://digilocker.gov.in/faq" target="_blank" rel="noopener noreferrer">
                <div className="text-left">
                  <div className="flex items-center mb-1">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    DigiLocker FAQ
                  </div>
                  <p className="text-sm text-gray-600">
                    Official DigiLocker help and documentation
                  </p>
                </div>
              </a>
            </Button>
            
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={() => {
                // This would typically open a support ticket or contact form
                window.open('mailto:support@yourplatform.com', '_blank');
              }}
            >
              <div className="text-left">
                <div className="flex items-center mb-1">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Contact Support
                </div>
                <p className="text-sm text-gray-600">
                  Get help from our support team
                </p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer Note */}
      <div className="text-center text-sm text-gray-500">
        <p>
          KYC verification is required to access certain features on our platform. 
          We apologize for any inconvenience and appreciate your patience.
        </p>
      </div>
    </div>
  );
}