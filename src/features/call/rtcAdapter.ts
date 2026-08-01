import type { CallCapability, CallControlState, CallMediaType, CallSessionContext } from './types';

export type CallRuntime = {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
};

export interface RtcAdapter {
  ensurePermission(mode: CallMediaType): Promise<CallCapability>;
  start(context: CallSessionContext): Promise<CallRuntime>;
  setMicMuted(muted: boolean): Promise<void>;
  setSpeakerOn(enabled: boolean): Promise<void>;
  setCameraEnabled(enabled: boolean): Promise<void>;
  end(): Promise<void>;
}

export class WebRtcShellAdapter implements RtcAdapter {
  private localStream: MediaStream | null = null;
  private control: CallControlState = {
    micMuted: false,
    speakerOn: false,
    cameraEnabled: true,
  };

  async ensurePermission(mode: CallMediaType): Promise<CallCapability> {
    const needVideo = mode === 'video';
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: needVideo,
      });
      stream.getTracks().forEach((track) => track.stop());
      return { canUseMic: true, canUseCamera: needVideo };
    } catch {
      return { canUseMic: false, canUseCamera: false };
    }
  }

  async start(context: CallSessionContext): Promise<CallRuntime> {
    const needVideo = context.mode === 'video';
    this.localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: needVideo,
    });
    this.control.cameraEnabled = needVideo;
    return {
      localStream: this.localStream,
      remoteStream: null,
    };
  }

  async setMicMuted(muted: boolean): Promise<void> {
    this.control.micMuted = muted;
    this.localStream?.getAudioTracks().forEach((track) => {
      track.enabled = !muted;
    });
  }

  async setSpeakerOn(enabled: boolean): Promise<void> {
    this.control.speakerOn = enabled;
  }

  async setCameraEnabled(enabled: boolean): Promise<void> {
    this.control.cameraEnabled = enabled;
    this.localStream?.getVideoTracks().forEach((track) => {
      track.enabled = enabled;
    });
  }

  async end(): Promise<void> {
    this.localStream?.getTracks().forEach((track) => track.stop());
    this.localStream = null;
  }
}
