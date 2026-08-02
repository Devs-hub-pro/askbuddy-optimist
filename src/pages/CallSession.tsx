import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Mic, MicOff, Phone, PhoneCall, PhoneOff, RotateCcw, Video, VideoOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  CALL_STATUS_LABEL,
  CONTENT_TARGET_TYPE,
  getCallErrorMessage,
  type CallMode,
  type ContentTargetType,
} from '@/contracts/callV1';
import { useAuth } from '@/contexts/AuthContext';
import { useCallSession } from '@/features/call';
import { useCallPermissions } from '@/hooks/useCallPermissions';
import SubPageHeader from '@/components/layout/SubPageHeader';
import { navigateBackOr } from '@/utils/navigation';

const readQuery = (search: string) => {
  const params = new URLSearchParams(search);
  const rawTargetType = params.get('targetType');
  const targetType = rawTargetType && CONTENT_TARGET_TYPE.includes(rawTargetType as ContentTargetType)
    ? rawTargetType as ContentTargetType
    : null;

  return {
    mode: (params.get('mode') === 'video' ? 'video' : 'voice') as CallMode,
    peerName: params.get('peer') || '对方用户',
    calleeId: params.get('calleeId'),
    targetType,
    targetId: params.get('targetId'),
    orderId: params.get('orderId'),
  };
};

const formatDuration = (startedAt: string | null, now: number) => {
  if (!startedAt) return '00:00';
  const seconds = Math.max(0, Math.floor((now - new Date(startedAt).getTime()) / 1000));
  const minutesPart = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secondsPart = String(seconds % 60).padStart(2, '0');
  return `${minutesPart}:${secondsPart}`;
};

const CallSession: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user } = useAuth();
  const query = useMemo(() => readQuery(location.search), [location.search]);
  const {
    session,
    resolvedSessionId,
    isLoading,
    activeAction,
    error,
    create,
    accept,
    reject,
    end,
    refresh,
  } = useCallSession({
    sessionId: sessionId && sessionId !== 'new' && sessionId !== 'order' ? sessionId : null,
    orderId: sessionId === 'order' ? query.orderId : null,
  });

  const mode = session?.mode || query.mode;
  const { permissionResult, isRequesting, requestPermissions } = useCallPermissions(mode);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'front' | 'rear'>('front');
  const [now, setNow] = useState(Date.now());

  const role = useMemo(() => {
    if (!session || !user) return null;
    if (session.caller_id === user.id) return 'caller';
    if (session.callee_id === user.id) return 'callee';
    return null;
  }, [session, user]);

  useEffect(() => {
    if (session?.status !== 'answered') return;
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [session?.status]);

  const durationLabel = useMemo(
    () => formatDuration(session?.started_at || null, now),
    [now, session?.started_at],
  );

  const handleCreate = async () => {
    if (!query.calleeId) return;
    const permissionGranted = await requestPermissions();
    if (!permissionGranted) return;

    const result = await create({
      p_callee_id: query.calleeId,
      p_mode: mode,
      p_target_type: query.targetType,
      p_target_id: query.targetId,
      p_order_id: query.orderId,
    });
    if (!result) return;

    const nextQuery = new URLSearchParams({ mode, peer: query.peerName });
    navigate(`/call/${result.call_session_id}?${nextQuery.toString()}`, {
      replace: true,
      state: location.state,
    });
  };

  const handleAccept = async () => {
    const permissionGranted = await requestPermissions();
    if (permissionGranted) await accept();
  };

  const isNewSession = sessionId === 'new';
  const canCreateSession = isNewSession || (
    sessionId === 'order' && !session && !isLoading && Boolean(query.calleeId)
  );
  const status = session?.status;
  const isBusy = Boolean(activeAction || isRequesting);
  const errorMessage = error ? getCallErrorMessage(error) : null;

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-white">
      <SubPageHeader title="Call v1" onBack={() => navigateBackOr(navigate, '/messages', { location })} />
      <div className="mx-auto max-w-md px-4 pb-10 pt-8">
        <div className="rounded-3xl border border-white/15 bg-white/5 p-5">
          <div className="text-xs text-white/70">
            Session: {resolvedSessionId || (canCreateSession ? '待创建' : '加载中')}
          </div>
          <div className="mt-3 text-2xl font-semibold">{query.peerName}</div>
          <div className="mt-1 text-sm text-white/75">
            {mode === 'video' ? '视频通话' : '语音通话'} · {status ? CALL_STATUS_LABEL[status] : canCreateSession ? '准备发起' : '正在读取会话'}
          </div>
          {status === 'answered' && <div className="mt-2 font-mono text-xl">{durationLabel}</div>}
          {role && <div className="mt-2 text-xs text-white/60">当前角色：{role === 'caller' ? '发起方' : '接听方'}</div>}
        </div>

        <div className="mt-4 rounded-3xl border border-white/15 bg-white/5 p-4 text-sm">
          <div>麦克风权限：{permissionResult.mic}</div>
          {mode === 'video' && <div className="mt-1">摄像头权限：{permissionResult.camera}</div>}
          {permissionResult.errorMessage && <div className="mt-2 text-red-300">{permissionResult.errorMessage}</div>}
          <Button className="mt-3 w-full" variant="secondary" onClick={requestPermissions} disabled={isBusy}>
            申请/检查媒体权限
          </Button>
        </div>

        {errorMessage && (
          <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
            <div>{errorMessage}</div>
            {!canCreateSession && (
              <Button className="mt-3" size="sm" variant="outline" onClick={() => void refresh()} disabled={isBusy}>
                重新读取
              </Button>
            )}
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3">
          {canCreateSession && (
            <Button
              className="col-span-2 h-11"
              onClick={handleCreate}
              disabled={isBusy || !user || !query.calleeId}
            >
              <PhoneCall size={16} className="mr-1" />
              {activeAction === 'create' ? '正在创建会话…' : '发起通话'}
            </Button>
          )}

          {!canCreateSession && isLoading && (
            <Button className="col-span-2 h-11" variant="secondary" disabled>正在读取通话会话…</Button>
          )}

          {status === 'ringing' && role === 'callee' && (
            <>
              <Button className="h-11" onClick={handleAccept} disabled={isBusy}>
                <PhoneCall size={16} className="mr-1" />接听
              </Button>
              <Button className="h-11" variant="destructive" onClick={() => void reject()} disabled={isBusy}>
                <PhoneOff size={16} className="mr-1" />拒绝
              </Button>
            </>
          )}

          {status === 'ringing' && role === 'caller' && (
            <Button className="col-span-2 h-11" variant="destructive" onClick={() => void end('caller_cancelled')} disabled={isBusy}>
              <PhoneOff size={16} className="mr-1" />取消呼叫
            </Button>
          )}

          {status === 'answered' && role && (
            <>
              <Button className="h-11" variant="secondary" onClick={() => setIsMuted((value) => !value)}>
                {isMuted ? <MicOff size={16} className="mr-1" /> : <Mic size={16} className="mr-1" />}
                {isMuted ? '取消静音' : '静音'}
              </Button>
              {mode === 'video' ? (
                <Button className="h-11" variant="secondary" onClick={() => setCameraFacing((value) => value === 'front' ? 'rear' : 'front')}>
                  <RotateCcw size={16} className="mr-1" />{cameraFacing === 'front' ? '前置' : '后置'}
                </Button>
              ) : (
                <Button className="h-11" variant="secondary" disabled><VideoOff size={16} className="mr-1" />语音模式</Button>
              )}
              <Button className="col-span-2 h-11" variant="destructive" onClick={() => void end()} disabled={isBusy}>
                <Phone size={16} className="mr-1" />挂断
              </Button>
            </>
          )}

          {status && ['ended', 'cancelled', 'timeout', 'failed'].includes(status) && (
            <Button className="col-span-2 h-11" variant="secondary" disabled>
              {mode === 'video' ? <Video size={16} className="mr-1" /> : <Phone size={16} className="mr-1" />}
              {CALL_STATUS_LABEL[status]}
            </Button>
          )}
        </div>

        <div className="mt-4 rounded-3xl border border-dashed border-white/20 p-4 text-xs leading-5 text-white/70">
          本版本仅同步 Call session 业务状态；静音、摄像头切换为本地 UI 状态，尚未接入真实音视频传输。
        </div>
      </div>
    </div>
  );
};

export default CallSession;
