// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Common component props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// P2P specific types (to be expanded)
export interface P2PConnection {
  id: string;
  peerId: string;
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  createdAt: string;
}

export interface P2PMessage {
  id: string;
  fromPeerId: string;
  toPeerId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'system';
}