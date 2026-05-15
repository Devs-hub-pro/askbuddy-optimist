import { useCallback, useMemo, useState } from 'react';
import type { CallMode } from '@/contracts/callV1';

export type PermissionState = 'idle' | 'granted' | 'denied' | 'unavailable' | 'error';

interface PermissionResult {
  mic: PermissionState;
  camera: PermissionState;
  errorMessage: string | null;
}

const initialResult: PermissionResult = {
  mic: 'idle',
  camera: 'idle',
  errorMessage: null,
};

export function useCallPermissions(mode: CallMode) {
  const [result, setResult] = useState<PermissionResult>(initialResult);
  const [isRequesting, setIsRequesting] = useState(false);

  const requestPermissions = useCallback(async () => {
    if (!navigator?.mediaDevices?.getUserMedia) {
      setResult({
        mic: 'unavailable',
        camera: mode === 'video' ? 'unavailable' : 'idle',
        errorMessage: '当前设备不支持音视频权限申请，请使用支持麦克风/摄像头的设备。',
      });
      return false;
    }

    setIsRequesting(true);
    try {
      const constraints = mode === 'video' ? { audio: true, video: true } : { audio: true, video: false };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      stream.getTracks().forEach((track) => track.stop());

      setResult({
        mic: 'granted',
        camera: mode === 'video' ? 'granted' : 'idle',
        errorMessage: null,
      });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : '权限申请失败';
      setResult({
        mic: 'denied',
        camera: mode === 'video' ? 'denied' : 'idle',
        errorMessage: `权限申请失败：${message}`,
      });
      return false;
    } finally {
      setIsRequesting(false);
    }
  }, [mode]);

  const canStartCall = useMemo(() => {
    if (mode === 'video') {
      return result.mic === 'granted' && result.camera === 'granted';
    }
    return result.mic === 'granted';
  }, [mode, result.camera, result.mic]);

  return {
    permissionResult: result,
    canStartCall,
    isRequesting,
    requestPermissions,
  };
}
