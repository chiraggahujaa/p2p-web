import api from './axios';
import { DocumentType } from '@/features/kyc/types/digilockerTypes';

// Types for DigiLocker API
export interface InitiateSessionRequest {
  documentsRequested?: DocumentType[];
  redirectUrl?: string;
}

export interface InitiateSessionResponse {
  success: boolean;
  data?: {
    sessionId: string;
    redirectUrl: string;
  };
  message?: string;
  error?: string;
}

export interface SessionCallbackRequest {
  sessionId: string;
  code?: string;
  state?: string;
  error?: string;
}

export interface FetchDocumentsRequest {
  sessionId: string;
}

export interface DigiLockerDocument {
  id: string;
  sessionId: string;
  userId: string;
  documentType: DocumentType;
  documentName: string;
  documentUrl: string;
  documentData: Record<string, unknown>;
  fileSize: number;
  mimeType: string;
  downloadUrl: string;
  downloadedAt: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface DigiLockerSession {
  id: string;
  userId: string;
  sandboxSessionId: string;
  redirectUrl: string;
  callbackUrl: string;
  status: 'initiated' | 'redirected' | 'authorized' | 'documents_fetched' | 'expired' | 'failed';
  documentsRequested: DocumentType[];
  consentGiven: boolean;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionStatusResponse {
  success: boolean;
  data?: DigiLockerSession & {
    documents?: DigiLockerDocument[];
    message?: string;
  };
  error?: string;
}

export interface FetchDocumentsResponse {
  success: boolean;
  data?: {
    sessionId: string;
    documents: DigiLockerDocument[];
    fetchedAt: string;
  };
  message?: string;
  error?: string;
}

export interface KycStatusResponse {
  success: boolean;
  data?: {
    isVerified: boolean;
    verificationMethod: string | null;
    verifiedAt: string | null;
    documentsCount: number;
    latestSessionStatus: string | null;
    activeSession: DigiLockerSession | null;
  };
  error?: string;
}

export interface UserDocumentsResponse {
  success: boolean;
  data?: {
    documents: Array<{
      id: string;
      documentType: DocumentType;
      documentName: string;
      fileSize: number;
      mimeType: string;
      downloadedAt: string;
      expiresAt: string;
    }>;
    count: number;
  };
  error?: string;
}

interface ApiErrorResponse {
  success: boolean;
  error?: string;
  message?: string;
}

const DIGILOCKER_BASE_URL = '/api/user/kyc/digilocker';

// Initiate DigiLocker verification session
export const initiateDigiLockerSession = async (data: InitiateSessionRequest): Promise<InitiateSessionResponse> => {
  try {
    const response = await api.post(`${DIGILOCKER_BASE_URL}/initiate`, data);
    return response.data;
  } catch (error: unknown) {
    console.error('Initiate DigiLocker session API error:', error);

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: ApiErrorResponse } };
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }
    }
    
    return {
      success: false,
      error: 'Failed to initiate DigiLocker session. Please try again.',
    };
  }
};

// Handle DigiLocker callback
export const handleDigiLockerCallback = async (params: SessionCallbackRequest): Promise<SessionStatusResponse> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('sessionId', params.sessionId);
    if (params.code) queryParams.append('code', params.code);
    if (params.state) queryParams.append('state', params.state);
    if (params.error) queryParams.append('error', params.error);

    const response = await api.get(`${DIGILOCKER_BASE_URL}/callback?${queryParams.toString()}`);
    return response.data;
  } catch (error: unknown) {
    console.error('DigiLocker callback API error:', error);

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: ApiErrorResponse } };
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }
    }
    
    return {
      success: false,
      error: 'Failed to handle DigiLocker callback. Please try again.',
    };
  }
};

// Get DigiLocker session status
export const getDigiLockerSessionStatus = async (sessionId: string): Promise<SessionStatusResponse> => {
  try {
    const response = await api.get(`${DIGILOCKER_BASE_URL}/session/${sessionId}`);
    return response.data;
  } catch (error: unknown) {
    console.error('Get DigiLocker session status API error:', error);

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: ApiErrorResponse } };
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }
    }
    
    return {
      success: false,
      error: 'Failed to get session status.',
    };
  }
};

// Fetch documents from DigiLocker
export const fetchDigiLockerDocuments = async (data: FetchDocumentsRequest): Promise<FetchDocumentsResponse> => {
  try {
    const response = await api.post(`${DIGILOCKER_BASE_URL}/fetch-documents`, data);
    return response.data;
  } catch (error: unknown) {
    console.error('Fetch DigiLocker documents API error:', error);

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: ApiErrorResponse } };
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }
    }
    
    return {
      success: false,
      error: 'Failed to fetch documents from DigiLocker.',
    };
  }
};

// Get KYC status for current user (keeping backward compatibility)
export const getKycStatus = async (): Promise<KycStatusResponse> => {
  try {
    const response = await api.get('/api/user/kyc/status');
    return response.data;
  } catch (error: unknown) {
    console.error('Get KYC status API error:', error);

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: ApiErrorResponse } };
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }
    }
    
    return {
      success: false,
      error: 'Failed to get KYC status.',
    };
  }
};

// Cancel DigiLocker session
export const cancelDigiLockerSession = async (sessionId: string) => {
  try {
    const response = await api.delete(`${DIGILOCKER_BASE_URL}/session/${sessionId}`);
    return response.data;
  } catch (error: unknown) {
    console.error('Cancel DigiLocker session API error:', error);

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: ApiErrorResponse } };
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }
    }
    
    return {
      success: false,
      error: 'Failed to cancel session.',
    };
  }
};

// Get user's DigiLocker documents
export const getUserDigiLockerDocuments = async (): Promise<UserDocumentsResponse> => {
  try {
    const response = await api.get(`${DIGILOCKER_BASE_URL}/documents`);
    return response.data;
  } catch (error: unknown) {
    console.error('Get user DigiLocker documents API error:', error);

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: ApiErrorResponse } };
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }
    }
    
    return {
      success: false,
      error: 'Failed to get user documents.',
    };
  }
};