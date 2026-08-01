import type { CallMode, CallStatus } from '../../../packages/shared-types/src/contracts';

export type CallMediaType = CallMode;

export type CallParticipantRole = 'caller' | 'callee';

export type CallUiStatus =
  | 'loading_session'
  | 'ringing'
  | 'requesting_permission'
  | 'connecting_media'
  | 'in_call'
  | 'background'
  | 'ending'
  | 'ended'
  | 'cancelled'
  | 'timeout'
  | 'failed';

export const mapCallStatusToUiStatus = (status: CallStatus): CallUiStatus => {
  switch (status) {
    case 'initiated':
    case 'ringing':
      return 'ringing';
    case 'answered':
      return 'in_call';
    case 'ended':
      return 'ended';
    case 'cancelled':
      return 'cancelled';
    case 'timeout':
      return 'timeout';
    case 'failed':
      return 'failed';
  }
};

export type CallSessionContext = {
  sessionId: string;
  peerId: string;
  peerName?: string;
  mode: CallMediaType;
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
