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

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      const target = e.target as HTMLElement | null;

      if (!target) return;

      // 只允许从左边缘触发，避免与普通横向滑动冲突
      if (touch.clientX >= 24) return;

      // 输入中、弹层开启、横向滚动容器内都禁用返回手势
      if (shouldIgnoreSwipeStart(target)) return;

      {
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
      
      // 垂直位移过大或非右滑时，取消返回手势
      if (deltaY > Math.abs(deltaX) || deltaX <= 0) {
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

const shouldIgnoreSwipeStart = (target: HTMLElement) => {
  // 在输入控件或可编辑区域触摸时不触发返回
  if (target.closest('input, textarea, select, [contenteditable="true"]')) {
    return true;
  }

  // 弹窗/抽屉/Sheet/Popover 等浮层开启时禁用
  if (document.querySelector('[data-state="open"][role="dialog"], [data-radix-popper-content-wrapper]')) {
    return true;
  }

  // 自定义标记的区域可强制禁用
  if (target.closest('[data-no-swipe-back="true"]')) {
    return true;
  }

  // 若触点在横向滚动容器内，禁用手势返回
  let node: HTMLElement | null = target;
  while (node && node !== document.body) {
    const style = window.getComputedStyle(node);
    const overflowX = style.overflowX;
    const isHorizontalScrollable =
      (overflowX === 'auto' || overflowX === 'scroll') && node.scrollWidth > node.clientWidth + 8;

    if (isHorizontalScrollable) {
      return true;
    }
    node = node.parentElement;
  }

  return false;
};
