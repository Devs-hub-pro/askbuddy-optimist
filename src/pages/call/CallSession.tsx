import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Mic, MicOff, PhoneOff, Video, VideoOff, Volume2, VolumeX } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageStateCard from '@/components/common/PageStateCard';
import { navigateBackOr } from '@/utils/navigation';
import { WebRtcShellAdapter } from '@/features/call/rtcAdapter';
import type { CallMediaType, CallUiStatus } from '@/features/call/types';
import { useCallLifecycle } from '@/features/call/useCallLifecycle';
import { endCallSession, heartbeatCallSession } from '@/features/call/callRpc';

type LocationState = {
  peerId?: string;
  peerName?: string;
  mediaType?: CallMediaType;
  orderId?: string;
  isMockSession?: boolean;
};

const statusLabel: Record<CallUiStatus, string> = {
  idle: '待接入',
  requesting_permission: '申请权限中',
  connecting: '连接中',
  in_call: '通话中',
  background: '后台运行',
  ending: '正在结束',
  ended: '已结束',
  failed: '连接失败',
};

const CallSession: React.FC = () => {
  const { sessionId = '' } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;

  const peerId = state.peerId || sessionId;
  const peerName = state.peerName || '对方';
  const mediaType: CallMediaType = state.mediaType || 'audio';
  const orderId = state.orderId;
  const isMockSession = !!state.isMockSession || sessionId.startsWith('mock-');

  const adapterRef = useRef(new WebRtcShellAdapter());
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  const [status, setStatus] = useState<CallUiStatus>('idle');
  const [errorText, setErrorText] = useState<string>('');
  const [micMuted, setMicMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(mediaType === 'video');

  const subtitle = useMemo(() => {
    const kind = mediaType === 'video' ? '视频通话' : '语音通话';
    const order = orderId ? ` · 订单 ${orderId.slice(0, 8)}` : '';
    return `${kind}${order}`;
  }, [mediaType, orderId]);

  const attachLocalPreview = useCallback((stream: MediaStream | null) => {
    if (!localVideoRef.current) return;
    localVideoRef.current.srcObject = stream;
  }, []);

  const startCall = useCallback(async () => {
    try {
      setStatus('requesting_permission');
      setErrorText('');
      const capability = await adapterRef.current.ensurePermission(mediaType);
      if (!capability.canUseMic || (mediaType === 'video' && !capability.canUseCamera)) {
        setStatus('failed');
        setErrorText('麦克风或摄像头权限未授予');
        return;
      }

      setStatus('connecting');
      const runtime = await adapterRef.current.start({
        sessionId,
        peerId,
        peerName,
        mediaType,
        orderId,
      });
      attachLocalPreview(runtime.localStream);
      setStatus('in_call');
    } catch (error) {
      setStatus('failed');
      setErrorText(error instanceof Error ? error.message : '无法启动通话');
    }
  }, [attachLocalPreview, mediaType, orderId, peerId, peerName, sessionId]);

  const endCall = useCallback(async () => {
    setStatus('ending');
    if (!isMockSession) {
      try {
        await endCallSession({
          p_call_session_id: sessionId,
          p_reason: 'ended_by_user',
        });
      } catch {
        // Keep UX responsive even if backend call fails.
      }
    }
    await adapterRef.current.end();
    attachLocalPreview(null);
    setStatus('ended');
    window.setTimeout(() => {
      navigateBackOr(navigate, '/messages', { location });
    }, 350);
  }, [attachLocalPreview, isMockSession, location, navigate, sessionId]);

  const toggleMic = useCallback(async () => {
    const next = !micMuted;
    await adapterRef.current.setMicMuted(next);
    setMicMuted(next);
  }, [micMuted]);

  const toggleSpeaker = useCallback(async () => {
    const next = !speakerOn;
    await adapterRef.current.setSpeakerOn(next);
    setSpeakerOn(next);
  }, [speakerOn]);

  const toggleCamera = useCallback(async () => {
    const next = !cameraEnabled;
    await adapterRef.current.setCameraEnabled(next);
    setCameraEnabled(next);
  }, [cameraEnabled]);

  useCallLifecycle({
    onBackground: () => {
      setStatus((prev) => (prev === 'in_call' ? 'background' : prev));
    },
    onForeground: () => {
      setStatus((prev) => (prev === 'background' ? 'in_call' : prev));
    },
  });

  useEffect(() => {
    void startCall();
    return () => {
      void adapterRef.current.end();
    };
  }, [startCall]);

  useEffect(() => {
    if (isMockSession) return;
    if (status !== 'in_call' && status !== 'background') return;

    const timer = window.setInterval(() => {
      void heartbeatCallSession({ p_call_session_id: sessionId });
    }, 15000);

    return () => {
      window.clearInterval(timer);
    };
  }, [isMockSession, sessionId, status]);

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-white">
      <div style={{ paddingTop: 'env(safe-area-inset-top)' }} />
      <div className="mx-auto flex max-w-md flex-col px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-5">
        <div className="text-center">
          <h1 className="text-xl font-semibold">{peerName}</h1>
          <p className="mt-1 text-sm text-slate-300">{subtitle}</p>
          <p className="mt-2 text-xs text-emerald-300">{statusLabel[status]}</p>
          {isMockSession ? (
            <p className="mt-1 text-[11px] text-amber-300">当前为本地 mock 会话（等待 A 侧 RPC 上线）</p>
          ) : null}
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-white/15 bg-black/30">
          <div className="aspect-[3/4] w-full">
            {mediaType === 'video' ? (
              <video ref={localVideoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">语音通话无本地视频预览</div>
            )}
          </div>
        </div>

        {status === 'failed' ? (
          <div className="mt-4">
            <PageStateCard
              compact
              variant="error"
              title="通话暂时不可用"
              description={errorText || '请检查权限后重试'}
              actionLabel="重试"
              onAction={() => void startCall()}
            />
          </div>
        ) : null}

        <div className="mt-8 grid grid-cols-3 gap-3">
          <Button variant="secondary" className="h-12 rounded-full" onClick={() => void toggleMic()}>
            {micMuted ? <MicOff size={18} /> : <Mic size={18} />}
          </Button>
          <Button variant="secondary" className="h-12 rounded-full" onClick={() => void toggleSpeaker()}>
            {speakerOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </Button>
          <Button
            variant="secondary"
            className="h-12 rounded-full"
            onClick={() => void toggleCamera()}
            disabled={mediaType !== 'video'}
          >
            {cameraEnabled ? <Video size={18} /> : <VideoOff size={18} />}
          </Button>
        </div>

        <Button className="mt-5 h-12 rounded-full bg-red-600 hover:bg-red-700" onClick={() => void endCall()}>
          <PhoneOff size={18} className="mr-2" />
          结束通话
        </Button>
      </div>
    </div>
  );
};

export default CallSession;
