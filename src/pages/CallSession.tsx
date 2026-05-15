import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Mic, MicOff, Phone, PhoneCall, PhoneOff, RotateCcw, Video, VideoOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type CallMode, type CallStatus } from '@/contracts/callV1';
import { useCallPermissions } from '@/hooks/useCallPermissions';
import { useMockCallSession, type CallRole } from '@/hooks/useMockCallSession';
import SubPageHeader from '@/components/layout/SubPageHeader';
import { navigateBackOr } from '@/utils/navigation';

const readQuery = (search: string) => {
  const params = new URLSearchParams(search);
  const mode = (params.get('mode') === 'video' ? 'video' : 'voice') as CallMode;
  const role = (params.get('role') === 'callee' ? 'callee' : 'caller') as CallRole;
  const peerName = params.get('peer') || '对方用户';
  return { mode, role, peerName };
};

const statusLabel: Record<CallStatus, string> = {
  initiated: '发起中',
  ringing: '来电响铃中',
  answered: '通话中',
  ended: '通话已结束',
  cancelled: '已取消/拒绝',
  timeout: '通话超时',
  failed: '通话异常中断',
};

const CallSession: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId } = useParams<{ sessionId: string }>();
  const { mode, role, peerName } = useMemo(() => readQuery(location.search), [location.search]);

  const { permissionResult, canStartCall, isRequesting, requestPermissions } = useCallPermissions(mode);
  const { status, isMuted, cameraFacing, durationLabel, actions } = useMockCallSession({ role });

  useEffect(() => {
    if (role === 'caller') {
      requestPermissions().then((ok) => {
        if (ok) {
          window.setTimeout(() => actions.ring(), 500);
          window.setTimeout(() => actions.answer(), 1200);
        }
      });
    }
  }, [actions, requestPermissions, role]);

  useEffect(() => {
    if (status === 'ringing' && canStartCall && role === 'callee') {
      const timer = window.setTimeout(() => actions.answer(), 300);
      return () => window.clearTimeout(timer);
    }
  }, [actions, canStartCall, role, status]);

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-white">
      <SubPageHeader title="Call v1 联调" onBack={() => navigateBackOr(navigate, '/messages', { location })} />
      <div className="mx-auto max-w-md px-4 pb-10 pt-8">
        <div className="rounded-3xl border border-white/15 bg-white/5 p-5">
          <div className="text-xs text-white/70">Session: {sessionId || 'mock-session'}</div>
          <div className="mt-3 text-2xl font-semibold">{peerName}</div>
          <div className="mt-1 text-sm text-white/75">{mode === 'video' ? '视频通话' : '语音通话'} · {statusLabel[status]}</div>
          {status === 'answered' && <div className="mt-2 text-xl font-mono">{durationLabel}</div>}
        </div>

        <div className="mt-4 rounded-3xl border border-white/15 bg-white/5 p-4 text-sm">
          <div>麦克风权限: {permissionResult.mic}</div>
          {mode === 'video' && <div className="mt-1">摄像头权限: {permissionResult.camera}</div>}
          {permissionResult.errorMessage && <div className="mt-2 text-red-300">{permissionResult.errorMessage}</div>}
          <Button className="mt-3 w-full" variant="secondary" onClick={requestPermissions} disabled={isRequesting}>
            重新申请权限
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {role === 'callee' && status === 'ringing' && (
            <>
              <Button className="h-11" onClick={actions.answer}><PhoneCall size={16} className="mr-1" />接听</Button>
              <Button className="h-11" variant="destructive" onClick={actions.reject}><PhoneOff size={16} className="mr-1" />拒绝</Button>
            </>
          )}

          {status === 'answered' && (
            <>
              <Button className="h-11" variant="secondary" onClick={actions.toggleMute}>
                {isMuted ? <MicOff size={16} className="mr-1" /> : <Mic size={16} className="mr-1" />}
                {isMuted ? '取消静音' : '静音'}
              </Button>
              {mode === 'video' ? (
                <Button className="h-11" variant="secondary" onClick={actions.flipCamera}>
                  <RotateCcw size={16} className="mr-1" />切摄像头({cameraFacing === 'front' ? '前置' : '后置'})
                </Button>
              ) : (
                <Button className="h-11" variant="secondary" disabled><VideoOff size={16} className="mr-1" />语音模式</Button>
              )}
              <Button className="col-span-2 h-11" variant="destructive" onClick={actions.endCall}><Phone size={16} className="mr-1" />挂断</Button>
            </>
          )}

          {!['initiated', 'ringing', 'answered'].includes(status) && (
            <Button className="col-span-2 h-11" variant="secondary" disabled>
              {mode === 'video' ? <Video size={16} className="mr-1" /> : <Phone size={16} className="mr-1" />}等待联调状态
            </Button>
          )}
        </div>

        <div className="mt-4 rounded-3xl border border-dashed border-white/20 p-4 text-xs text-white/75">
          <div className="mb-2">联调模拟控制</div>
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" onClick={actions.timeout}>模拟超时</Button>
            <Button size="sm" variant="outline" onClick={actions.fail}>模拟异常中断</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallSession;
