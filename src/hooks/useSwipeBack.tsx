import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SwipeBackOptions {
  threshold?: number; // 触发返回的最小滑动距离
  enabled?: boolean;  // 是否启用
}

export function useSwipeBack(options: SwipeBackOptions = {}) {
  const { threshold = 80, enabled = true } = options;
  const navigate = useNavigate();
  const location = useLocation();
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const isSwiping = useRef<boolean>(false);

  useEffect(() => {
    if (!enabled) return;

    // 首页不需要右滑返回
    if (location.pathname === '/') return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      // 只有从屏幕左边缘开始的滑动才触发返回
      if (touch.clientX < 30) {
        touchStartX.current = touch.clientX;
        touchStartY.current = touch.clientY;
        isSwiping.current = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isSwiping.current) return;
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = Math.abs(touch.clientY - touchStartY.current);
      
      // 如果垂直滑动大于水平滑动，取消返回手势
      if (deltaY > Math.abs(deltaX)) {
        isSwiping.current = false;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isSwiping.current) return;
      
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartX.current;
      
      // 如果右滑距离超过阈值，触发返回
      if (deltaX > threshold) {
        navigate(-1);
      }
      
      isSwiping.current = false;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, threshold, navigate, location.pathname]);
}
