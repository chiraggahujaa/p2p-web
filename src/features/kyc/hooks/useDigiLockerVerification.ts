import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  initiateDigiLockerSession,
  getDigiLockerSessionStatus,
  fetchDigiLockerDocuments,
  getKycStatus,
  cancelDigiLockerSession,
  handleDigiLockerCallback,
} from '@/lib/api/digilocker';
import {
  InitiateSessionRequest,
  SessionCallbackRequest,
  FetchDocumentsRequest,
  KycData,
  DigiLockerStep,
  SessionStatus,
  DocumentType
} from '../types/digilockerTypes';

export const useDigiLockerVerification = () => {
  const [currentStep, setCurrentStep] = useState<DigiLockerStep>('document_selection');
  const [sessionId, setSessionId] = useState<string>('');
  const [redirectUrl, setRedirectUrl] = useState<string>('');
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentType[]>(['aadhaar']);
  const [countdown, setCountdown] = useState<number>(0);
  const [verifiedData, setVerifiedData] = useState<KycData | null>(null);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('initiated');
  
  const queryClient = useQueryClient();

  // Countdown timer for session expiry
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Get KYC status
  const {
    data: kycStatus,
    isLoading: isLoadingStatus,
    refetch: refetchStatus,
  } = useQuery({
    queryKey: ['kyc-status'],
    queryFn: getKycStatus,
    refetchOnWindowFocus: false,
  });

  // Initiate DigiLocker session mutation
  const initiateSessionMutation = useMutation({
    mutationFn: (data: InitiateSessionRequest) => initiateDigiLockerSession(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        setSessionId(response.data.sessionId);
        setRedirectUrl(response.data.redirectUrl);
        setCurrentStep('session_initiated');
        setCountdown(3600); // 1 hour countdown
        toast.success(response.message || 'DigiLocker session initiated successfully');
      } else {
        toast.error(response.error || 'Failed to initiate DigiLocker session');
        setCurrentStep('error');
      }
    },
    onError: (error: unknown) => {
      console.error('Initiate session error:', error);
      toast.error('Failed to initiate DigiLocker session. Please try again.');
      setCurrentStep('error');
    },
  });

  // Handle DigiLocker callback mutation
  const handleCallbackMutation = useMutation({
    mutationFn: (data: SessionCallbackRequest) => handleDigiLockerCallback(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        setSessionStatus(response.data.status);
        
        if (response.data.status === 'authorized' && response.data.consentGiven) {
          setCurrentStep('processing');
          // Automatically fetch documents when authorized
          fetchDocumentsMutation.mutate({ sessionId: response.data.id });
        } else if (response.data.status === 'documents_fetched') {
          setCurrentStep('success');
        } else if (response.data.status === 'failed' || response.data.status === 'expired') {
          setCurrentStep('error');
          toast.error(response.data.message || 'DigiLocker verification failed');
        }
      } else {
        toast.error(response.error || 'Failed to process DigiLocker callback');
        setCurrentStep('error');
      }
    },
    onError: (error: unknown) => {
      console.error('Callback error:', error);
      toast.error('Failed to process DigiLocker callback. Please try again.');
      setCurrentStep('error');
    },
  });

  // Fetch documents mutation
  const fetchDocumentsMutation = useMutation({
    mutationFn: (data: FetchDocumentsRequest) => fetchDigiLockerDocuments(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const kycData: KycData = {
          verificationId: response.data.sessionId,
          documents: response.data.documents,
          verificationTimestamp: response.data.fetchedAt,
        };
        
        setVerifiedData(kycData);
        setCurrentStep('success');
        setCountdown(0);
        setSessionStatus('documents_fetched');
        
        toast.success(response.message || 'KYC verification completed successfully!');
        
        // Invalidate KYC status to refresh the data
        queryClient.invalidateQueries({ queryKey: ['kyc-status'] });
        
        // Invalidate user profile data to reflect verification status
        queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      } else {
        toast.error(response.error || 'Failed to fetch documents from DigiLocker');
        setCurrentStep('error');
      }
    },
    onError: (error: unknown) => {
      console.error('Fetch documents error:', error);
      toast.error('Failed to fetch documents from DigiLocker. Please try again.');
      setCurrentStep('error');
    },
  });

  // Get session status mutation (for polling)
  const getSessionStatusMutation = useMutation({
    mutationFn: (sessionId: string) => getDigiLockerSessionStatus(sessionId),
    onSuccess: (response) => {
      if (response.success && response.data) {
        setSessionStatus(response.data.status);
        
        // Update step based on status
        if (response.data.status === 'authorized' && response.data.consentGiven) {
          if (currentStep !== 'processing') {
            setCurrentStep('processing');
            // Auto-fetch documents when authorized
            fetchDocumentsMutation.mutate({ sessionId: response.data.id });
          }
        } else if (response.data.status === 'documents_fetched') {
          if (currentStep !== 'success') {
            setCurrentStep('success');
            if (response.data.documents) {
              const kycData: KycData = {
                verificationId: response.data.id,
                documents: response.data.documents,
                verificationTimestamp: new Date().toISOString(),
              };
              setVerifiedData(kycData);
            }
          }
        } else if (response.data.status === 'expired' || response.data.status === 'failed') {
          if (currentStep !== 'error') {
            setCurrentStep('error');
            toast.error(response.data.message || 'DigiLocker session failed');
          }
        }
      }
    },
  });

  // Cancel session mutation
  const cancelSessionMutation = useMutation({
    mutationFn: (sessionId: string) => cancelDigiLockerSession(sessionId),
    onSuccess: (response) => {
      if (response.success) {
        resetToInitialState();
        toast.success('DigiLocker session cancelled successfully');
      } else {
        toast.error(response.error || 'Failed to cancel session');
      }
    },
    onError: (error: unknown) => {
      console.error('Cancel session error:', error);
      toast.error('Failed to cancel session');
    },
  });

  // Helper functions
  const initiateVerification = (documentsRequested: DocumentType[] = ['aadhaar']) => {
    setSelectedDocuments(documentsRequested);
    initiateSessionMutation.mutate({ documentsRequested });
  };

  const redirectToDigiLocker = () => {
    if (redirectUrl) {
      setCurrentStep('redirected');
      // Open DigiLocker in the same tab for better UX
      window.location.href = redirectUrl;
    } else {
      toast.error('No redirect URL available');
    }
  };

  const handleCallback = (callbackParams: Omit<SessionCallbackRequest, 'sessionId'>) => {
    if (sessionId) {
      handleCallbackMutation.mutate({
        sessionId,
        ...callbackParams,
      });
    } else {
      toast.error('No active session found');
    }
  };

  const pollSessionStatus = () => {
    if (sessionId && !['documents_fetched', 'expired', 'failed'].includes(sessionStatus)) {
      getSessionStatusMutation.mutate(sessionId);
    }
  };

  const cancelCurrentSession = () => {
    if (sessionId) {
      cancelSessionMutation.mutate(sessionId);
    }
  };

  const resetToInitialState = () => {
    setCurrentStep('document_selection');
    setSessionId('');
    setRedirectUrl('');
    setSelectedDocuments(['aadhaar']);
    setCountdown(0);
    setVerifiedData(null);
    setSessionStatus('initiated');
  };

  const goBackToDocumentSelection = () => {
    if (sessionId && !['documents_fetched'].includes(sessionStatus)) {
      cancelCurrentSession();
    } else {
      resetToInitialState();
    }
  };

  // Format countdown as HH:MM:SS
  const formattedCountdown = () => {
    const hours = Math.floor(countdown / 3600);
    const minutes = Math.floor((countdown % 3600) / 60);
    const seconds = countdown % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Check if user is already verified
  const isAlreadyVerified = kycStatus?.data?.isVerified || false;

  // Check if there's an active session
  const hasActiveSession = kycStatus?.data?.activeSession?.status && 
    !['expired', 'failed', 'documents_fetched'].includes(kycStatus.data.activeSession.status);

  // Auto-poll for session status when in certain states
  useEffect(() => {
    if (sessionId && ['redirected', 'authorized'].includes(currentStep) && countdown > 0) {
      const pollInterval = setInterval(() => {
        pollSessionStatus();
      }, 5000); // Poll every 5 seconds

      return () => clearInterval(pollInterval);
    }
  }, [sessionId, currentStep, countdown, pollSessionStatus]);

  return {
    // State
    currentStep,
    sessionId,
    redirectUrl,
    selectedDocuments,
    countdown,
    verifiedData,
    sessionStatus,
    isAlreadyVerified,
    hasActiveSession,
    activeSession: kycStatus?.data?.activeSession || null,
    
    // Loading states
    isInitiatingSession: initiateSessionMutation.isPending,
    isHandlingCallback: handleCallbackMutation.isPending,
    isFetchingDocuments: fetchDocumentsMutation.isPending,
    isCancellingSession: cancelSessionMutation.isPending,
    isCheckingSessionStatus: getSessionStatusMutation.isPending,
    isLoadingStatus,
    
    // Functions
    initiateVerification,
    redirectToDigiLocker,
    handleCallback,
    pollSessionStatus,
    cancelCurrentSession,
    resetToInitialState,
    goBackToDocumentSelection,
    formattedCountdown,
    refetchStatus,
    setSelectedDocuments,
    
    // Computed values
    canStartVerification: !isAlreadyVerified && !hasActiveSession,
    isSessionExpired: countdown === 0 && sessionId !== '',
    canPollStatus: sessionId !== '' && !['documents_fetched', 'expired', 'failed'].includes(sessionStatus),
  };
};