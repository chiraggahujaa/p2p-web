// DigiLocker Document Types
export type DocumentType = 'aadhaar' | 'pan' | 'driving_license' | 'passport' | 'voter_id' | 'other';

// DigiLocker Session Status
export type SessionStatus = 
  | 'initiated'      // Session created, user not redirected yet
  | 'redirected'     // User redirected to DigiLocker
  | 'authorized'     // User authorized document access
  | 'documents_fetched' // Documents retrieved successfully
  | 'expired'        // Session expired
  | 'failed';        // Session failed

// DigiLocker Session Data
export interface DigiLockerSession {
  id: string;
  userId: string;
  sandboxSessionId: string;
  redirectUrl: string;
  callbackUrl: string;
  status: SessionStatus;
  documentsRequested: string[];
  consentGiven: boolean;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

// DigiLocker Document Data
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

// API Request Types
export interface InitiateSessionRequest {
  documentsRequested?: DocumentType[];
  redirectUrl?: string;
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

// API Response Types
export interface InitiateSessionResponse {
  success: boolean;
  data?: {
    sessionId: string;
    redirectUrl: string;
  };
  message?: string;
  error?: string;
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
    latestSessionStatus: SessionStatus | null;
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

// UI State Types
export type DigiLockerStep = 
  | 'document_selection'   // User selects documents to verify
  | 'session_initiated'    // Session created, showing redirect button
  | 'redirected'          // User redirected to DigiLocker
  | 'processing'          // Processing callback/fetching documents
  | 'success'             // Verification completed successfully
  | 'error';              // Error occurred

// Form Data Types
export interface DigiLockerFormData {
  documentsRequested: DocumentType[];
  agreedToTerms: boolean;
}

// KYC Data for successful verification
export interface KycData {
  verificationId: string;
  documents: DigiLockerDocument[];
  verificationTimestamp: string;
}

// Document Selection Options
export interface DocumentOption {
  id: DocumentType;
  label: string;
  description: string;
  required: boolean;
  icon?: string;
}

// Component Props Types
export interface DigiLockerVerificationProps {
  onSuccess?: (data: KycData) => void;
  onError?: (error: string) => void;
  className?: string;
}

export interface DocumentSelectorProps {
  selectedDocuments: DocumentType[];
  onDocumentsChange: (documents: DocumentType[]) => void;
  disabled?: boolean;
}

export interface SessionStatusProps {
  sessionId: string;
  onStatusChange?: (status: SessionStatus) => void;
  onDocumentsFetched?: (documents: DigiLockerDocument[]) => void;
}

export interface DigiLockerSuccessProps {
  verifiedData: KycData;
  onViewDocuments?: () => void;
  onClose?: () => void;
}

// Constants
export const DOCUMENT_OPTIONS: DocumentOption[] = [
  {
    id: 'aadhaar',
    label: 'Aadhaar Card',
    description: 'Government issued identity document',
    required: true,
    icon: '🆔'
  },
  {
    id: 'pan',
    label: 'PAN Card',
    description: 'Permanent Account Number',
    required: false,
    icon: '💳'
  },
  {
    id: 'driving_license',
    label: 'Driving License',
    description: 'Government issued driving license',
    required: false,
    icon: '🚗'
  },
  {
    id: 'passport',
    label: 'Passport',
    description: 'Government issued passport',
    required: false,
    icon: '📘'
  },
  {
    id: 'voter_id',
    label: 'Voter ID',
    description: 'Election Commission of India voter ID',
    required: false,
    icon: '🗳️'
  }
];

export const SESSION_STATUS_MESSAGES = {
  initiated: 'Session initialized successfully',
  redirected: 'Please complete verification on DigiLocker',
  authorized: 'Authorization successful, fetching documents...',
  documents_fetched: 'Documents retrieved successfully',
  expired: 'Session has expired, please start again',
  failed: 'Verification failed, please try again'
} as const;

export const DOCUMENT_TYPE_LABELS = {
  aadhaar: 'Aadhaar Card',
  pan: 'PAN Card',
  driving_license: 'Driving License',
  passport: 'Passport',
  voter_id: 'Voter ID',
  other: 'Other Document'
} as const;