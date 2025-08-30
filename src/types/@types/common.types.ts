export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

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

export interface CreateLocationDto {
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

