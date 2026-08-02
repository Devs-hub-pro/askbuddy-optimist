import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Mic, MicOff, Phone, PhoneOff, Video, VideoOff, Volume2, VolumeX } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageStateCard from '@/components/common/PageStateCard';
import { useAuth } from '@/contexts/AuthContext';
import { CallRpcError, useCallSession } from '@/features/call';
import { WebRtcShellAdapter } from '@/features/call/rtcAdapter';
import {
  mapCallStatusToUiStatus,
  type CallParticipantRole,
  type CallUiStatus,
} from '@/features/call/types';
import { useCallLifecycle } from '@/features/call/useCallLifecycle';
import { navigateBackOr } from '@/utils/navigation';
import type { CallSession as CallSessionRecord } from '../../../packages/shared-types/src/contracts';

type LocationState = {
  peerName?: string;
};

const statusLabel: Record<CallUiStatus, string> = {
  loading_session: '正在读取会话',
  ringing: '等待接听',
  requesting_permission: '申请权限中',
  connecting_media: '正在准备本地媒体',
  in_call: '已接通',
  background: '后台运行',
  ending: '正在结束',
  ended: '通话已结束',
  cancelled: '通话已取消',
  timeout: '无人接听',
  failed: '通话失败',
};

const terminalStatuses = new Set(['ended', 'cancelled', 'timeout', 'failed']);

const getErrorMessage = (error: unknown) => {
  if (error instanceof CallRpcError) {
    if (error.code === 'CALL_NOT_FOUND') return '会话不存在，或当前账号不是会话参与者';
    if (error.code === 'CALL_FORBIDDEN') return '当前账号无权执行该通话操作';
    if (error.code === 'CALL_INVALID_STATE') return '当前会话状态不允许执行此操作';
  }
  return error instanceof Error ? error.message : '通话服务暂时不可用';
};

const CallSession: React.FC = () => {
  const { sessionId = '' } = useParams<{ sessionId: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = (location.state || {}) as LocationState;

  const adapterRef = useRef(new WebRtcShellAdapter());
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStartedRef = useRef(false);
  const sessionRef = useRef<CallSessionRecord | null>(null);

  const [uiStatus, setUiStatus] = useState<CallUiStatus>('loading_session');
  const [localError, setLocalError] = useState('');
  const [isForeground, setIsForeground] = useState(true);
  const [micMuted, setMicMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);

  const publicSessionId = !authLoading && user && isForeground ? sessionId : null;
  const {
    session: liveSession,
    isLoading,
    activeAction,
    error: callError,
    refresh,
    accept,
    reject,
    end,
  } = useCallSession({ sessionId: publicSessionId });

  const session = liveSession || sessionRef.current;

  const role = useMemo<CallParticipantRole | null>(() => {
    if (!session || !user) return null;
    if (session.caller_id === user.id) return 'caller';
    if (session.callee_id === user.id) return 'callee';
    return null;
  }, [session, user]);

  const peerId = useMemo(() => {
    if (!session || !user) return '';
    return session.caller_id === user.id ? session.callee_id : session.caller_id;
  }, [session, user]);

  const peerName = routeState.peerName || (peerId ? `用户 ${peerId.slice(0, 8)}` : '对方');
  const isTerminal = !!session && terminalStatuses.has(session.status);
  const errorText = localError || (callError ? getErrorMessage(callError) : '');

  const attachLocalPreview = useCallback((stream: MediaStream | null) => {
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
  }, []);

  useEffect(() => {
    sessionRef.current = null;
    mediaStartedRef.current = false;
    setUiStatus('loading_session');
    setLocalError('');
  }, [sessionId]);

  useEffect(() => {
    if (!liveSession) return;
    sessionRef.current = liveSession;
    setLocalError('');
    setUiStatus(
      !isForeground && liveSession.status === 'answered'
        ? 'background'
        : mapCallStatusToUiStatus(liveSession.status)
    );
  }, [isForeground, liveSession]);

  useEffect(() => {
    if (authLoading || user) return;
    setLocalError('请先登录后再进入通话');
    setUiStatus('failed');
  }, [authLoading, user]);

  useEffect(() => {
    if (!liveSession || role) return;
    setLocalError('当前账号不是该通话的参与者');
    setUiStatus('failed');
  }, [liveSession, role]);

  useCallLifecycle({
    onBackground: useCallback(() => {
      setIsForeground(false);
      if (sessionRef.current?.status === 'answered') setUiStatus('background');
    }, []),
    onForeground: useCallback(() => {
      setIsForeground(true);
    }, []),
  });

  useEffect(() => {
    if (session?.status !== 'answered' || mediaStartedRef.current) return;
    let active = true;
    mediaStartedRef.current = true;

    const startLocalMediaShell = async () => {
      try {
        setUiStatus('requesting_permission');
        const capability = await adapterRef.current.ensurePermission(session.mode);
        if (!capability.canUseMic || (session.mode === 'video' && !capability.canUseCamera)) {
          throw new Error('麦克风或摄像头权限未授予');
        }

        setUiStatus('connecting_media');
        const runtime = await adapterRef.current.start({
          sessionId: session.id,
          peerId,
          peerName,
          mode: session.mode,
          orderId: session.order_id || undefined,
        });
        if (!active) {
          await adapterRef.current.end();
          return;
        }
        attachLocalPreview(runtime.localStream);
        setCameraEnabled(session.mode === 'video');
        setUiStatus('in_call');
      } catch (error) {
        mediaStartedRef.current = false;
        setLocalError(getErrorMessage(error));
        setUiStatus('failed');
      }
    };

    void startLocalMediaShell();
    return () => {
      active = false;
    };
  }, [attachLocalPreview, peerId, peerName, session]);

  useEffect(() => {
    if (!isTerminal) return;
    mediaStartedRef.current = false;
    void adapterRef.current.end();
    attachLocalPreview(null);
  }, [attachLocalPreview, isTerminal]);

  useEffect(() => () => {
    mediaStartedRef.current = false;
    void adapterRef.current.end();
  }, []);

  const acceptCall = useCallback(async () => {
    if (role !== 'callee' || session?.status !== 'ringing') return;
    setLocalError('');
    await accept();
  }, [accept, role, session?.status]);

  const rejectCall = useCallback(async () => {
    if (role !== 'callee' || session?.status !== 'ringing') return;
    setLocalError('');
    await reject('rejected_by_callee');
  }, [reject, role, session?.status]);

  const endCall = useCallback(async () => {
    if (!session || (session.status !== 'ringing' && session.status !== 'answered')) return;
    setUiStatus('ending');
    setLocalError('');
    const result = await end(
      session.status === 'ringing' ? 'cancelled_by_caller' : 'ended_by_user'
    );
    if (!result) setUiStatus(mapCallStatusToUiStatus(session.status));
  }, [end, session]);

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

  const goBack = () => navigateBackOr(navigate, '/messages', { location });

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-white">
      <div style={{ paddingTop: 'env(safe-area-inset-top)' }} />
      <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-5">
        <div className="text-center">
          <h1 className="text-xl font-semibold">{peerName}</h1>
          <p className="mt-1 text-sm text-slate-300">
            {session?.mode === 'video' ? '视频通话' : '语音通话'}
          </p>
          <p className="mt-2 text-xs text-emerald-300">{statusLabel[uiStatus]}</p>
          {session ? (
            <p className="mt-1 text-[11px] text-slate-400">
              后端状态：{session.status} · {role === 'callee' ? '被叫方' : '主叫方'}
            </p>
          ) : null}
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-white/15 bg-black/30">
          <div className="aspect-[3/4] w-full">
            {session?.mode === 'video' ? (
              <video ref={localVideoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center text-slate-400">
                本轮仅接入会话状态；RTC 适配器暂只保留本地媒体占位
              </div>
            )}
          </div>
        </div>

        {errorText ? (
          <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-950/50 px-4 py-3 text-sm text-red-100">
            {errorText}
          </div>
        ) : null}

        {(isLoading || uiStatus === 'loading_session') && !session ? (
          <div className="mt-4">
            <PageStateCard compact variant="loading" title="正在读取通话会话" />
          </div>
        ) : null}

        {session?.status === 'answered' ? (
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
              disabled={session.mode !== 'video'}
            >
              {cameraEnabled ? <Video size={18} /> : <VideoOff size={18} />}
            </Button>
          </div>
        ) : null}

        {session?.status === 'ringing' && role === 'callee' ? (
          <div className="mt-8 grid grid-cols-2 gap-3">
            <Button
              className="h-12 rounded-full bg-emerald-600 hover:bg-emerald-700"
              onClick={() => void acceptCall()}
              disabled={activeAction !== null}
            >
              <Phone size={18} className="mr-2" />接听
            </Button>
            <Button
              className="h-12 rounded-full bg-red-600 hover:bg-red-700"
              onClick={() => void rejectCall()}
              disabled={activeAction !== null}
            >
              <PhoneOff size={18} className="mr-2" />拒绝
            </Button>
          </div>
        ) : null}

        {(session?.status === 'answered' || (session?.status === 'ringing' && role === 'caller')) ? (
          <Button
            className="mt-5 h-12 rounded-full bg-red-600 hover:bg-red-700"
            onClick={() => void endCall()}
            disabled={activeAction !== null}
          >
            <PhoneOff size={18} className="mr-2" />
            {session.status === 'ringing' ? '取消呼叫' : '结束通话'}
          </Button>
        ) : null}

        {(isTerminal || (!session && !isLoading && uiStatus === 'failed')) ? (
          <div className="mt-5 grid grid-cols-1 gap-3">
            {!session && user ? (
              <Button variant="secondary" className="h-12 rounded-full" onClick={() => void refresh()}>
                重试读取
              </Button>
            ) : null}
            <Button variant="secondary" className="h-12 rounded-full" onClick={goBack}>
              返回消息
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CallSession;
