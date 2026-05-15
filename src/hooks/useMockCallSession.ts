import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CallStatus } from '@/contracts/callV1';

export type CallRole = 'caller' | 'callee';

interface Options {
  role: CallRole;
}

export function useMockCallSession(options: Options) {
  const [status, setStatus] = useState<CallStatus>(options.role === 'callee' ? 'ringing' : 'initiated');
  const [isMuted, setIsMuted] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'front' | 'rear'>('front');
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (status === 'answered') {
      if (timerRef.current === null) {
        timerRef.current = window.setInterval(() => setSeconds((value) => value + 1), 1000);
      }
      return;
    }

    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [status]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  const ring = useCallback(() => setStatus('ringing'), []);
  const answer = useCallback(() => setStatus('answered'), []);
  const reject = useCallback(() => setStatus('cancelled'), []);
  const endCall = useCallback(() => setStatus('ended'), []);
  const timeout = useCallback(() => setStatus('timeout'), []);
  const fail = useCallback(() => setStatus('failed'), []);
  const toggleMute = useCallback(() => setIsMuted((v) => !v), []);
  const flipCamera = useCallback(() => setCameraFacing((v) => (v === 'front' ? 'rear' : 'front')), []);

  const durationLabel = useMemo(() => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  }, [seconds]);

  return {
    status,
    isMuted,
    cameraFacing,
    durationLabel,
    actions: {
      ring,
      answer,
      reject,
      endCall,
      timeout,
      fail,
      toggleMute,
      flipCamera,
    },
  };
}
