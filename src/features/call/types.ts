export type CallMediaType = 'audio' | 'video';

export type CallUiStatus =
  | 'idle'
  | 'requesting_permission'
  | 'connecting'
  | 'in_call'
  | 'background'
  | 'ending'
  | 'ended'
  | 'failed';

export type CallSessionContext = {
  sessionId: string;
  peerId: string;
  peerName?: string;
  mediaType: CallMediaType;
  orderId?: string;
};

export type CallCapability = {
  canUseMic: boolean;
  canUseCamera: boolean;
};

export type CallControlState = {
  micMuted: boolean;
  speakerOn: boolean;
  cameraEnabled: boolean;
};
