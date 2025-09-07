"use client";

import { useDigiLockerVerification } from "../hooks/useDigiLockerVerification";
import { DigiLockerVerificationProps } from "../types/digilockerTypes";
import { DocumentSelector } from "./DocumentSelector";
import { SessionInitiated } from "./SessionInitiated";
import { ProcessingStatus } from "./ProcessingStatus";
import { DigiLockerSuccess } from "./DigiLockerSuccess";
import { VerificationError } from "./VerificationError";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export function DigiLockerVerification({ 
  onSuccess, 
  onError, 
  className 
}: DigiLockerVerificationProps) {
  const {
    currentStep,
    sessionId,
    redirectUrl,
    selectedDocuments,
    verifiedData,
    sessionStatus,
    isAlreadyVerified,
    hasActiveSession,
    activeSession,
    isInitiatingSession,
    isHandlingCallback,
    isFetchingDocuments,
    isLoadingStatus,
    initiateVerification,
    redirectToDigiLocker,
    cancelCurrentSession,
    resetToInitialState,
    goBackToDocumentSelection,
    setSelectedDocuments,
    canStartVerification,
  } = useDigiLockerVerification();

  // Handle success callback
  if (currentStep === 'success' && verifiedData && onSuccess) {
    onSuccess(verifiedData);
  }

  // Handle error callback
  if (currentStep === 'error' && onError) {
    onError('DigiLocker verification failed');
  }

  if (isLoadingStatus) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-8">
          <LoadingSpinner />
          <span className="ml-2">Loading verification status...</span>
        </CardContent>
      </Card>
    );
  }

  // Show already verified state
  if (isAlreadyVerified) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center text-green-600">
            <CheckCircle className="mr-2 h-5 w-5" />
            KYC Verification Complete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Your identity has already been verified through DigiLocker. 
              You can now access all platform features.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Show active session warning
  if (hasActiveSession && activeSession && !sessionId) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center text-amber-600">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Active Verification Session
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You have an active DigiLocker verification session. 
              Please complete it or cancel to start a new one.
            </AlertDescription>
          </Alert>
          <div className="flex gap-2">
            <button
              onClick={() => window.location.href = activeSession.redirectUrl}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Continue Verification
            </button>
            <button
              onClick={() => cancelCurrentSession()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Cancel Session
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>KYC Verification via DigiLocker</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Step indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className={currentStep === 'document_selection' ? 'font-semibold text-blue-600' : ''}>
              1. Select Documents
            </span>
            <span className={currentStep === 'session_initiated' ? 'font-semibold text-blue-600' : ''}>
              2. DigiLocker Redirect
            </span>
            <span className={['processing', 'success'].includes(currentStep) ? 'font-semibold text-blue-600' : ''}>
              3. Verification Complete
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: currentStep === 'document_selection' ? '33%' : 
                       currentStep === 'session_initiated' ? '66%' : '100%'
              }}
            />
          </div>
        </div>

        {/* Render appropriate component based on current step */}
        {currentStep === 'document_selection' && (
          <DocumentSelector
            selectedDocuments={selectedDocuments}
            onDocumentsChange={setSelectedDocuments}
            disabled={!canStartVerification || isInitiatingSession}
            onInitiate={() => initiateVerification(selectedDocuments)}
            isInitiating={isInitiatingSession}
          />
        )}

        {currentStep === 'session_initiated' && (
          <SessionInitiated
            redirectUrl={redirectUrl}
            onRedirect={redirectToDigiLocker}
            onCancel={goBackToDocumentSelection}
            sessionId={sessionId}
          />
        )}

        {(currentStep === 'redirected' || currentStep === 'processing') && (
          <ProcessingStatus
            status={sessionStatus}
            sessionId={sessionId}
            isProcessing={isHandlingCallback || isFetchingDocuments}
            onCancel={goBackToDocumentSelection}
          />
        )}

        {currentStep === 'success' && verifiedData && (
          <DigiLockerSuccess
            verifiedData={verifiedData}
            onClose={resetToInitialState}
          />
        )}

        {currentStep === 'error' && (
          <VerificationError
            onRetry={goBackToDocumentSelection}
            onCancel={resetToInitialState}
          />
        )}
      </CardContent>
    </Card>
  );
}