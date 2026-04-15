import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getFallbackPathForRoute, navigateBackOr } from '@/utils/navigation';

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
    const swipeScope = getSwipeScopeElement();
    if (!swipeScope) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      const target = e.target as HTMLElement | null;

      if (!target) return;

      // 只允许从左边缘触发，避免与普通横向滑动冲突
      if (touch.clientX >= 24) return;

      // 仅在 App 主容器内响应，避免 document 级全局误触
      if (!isWithinSwipeScope(target, swipeScope)) return;

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
      
      // 左滑或垂直意图更强时，取消返回手势
      if (deltaX <= 0 || deltaY > Math.abs(deltaX) * 0.75) {
        isSwiping.current = false;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isSwiping.current) return;
      
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartX.current;
      
      // 如果右滑距离超过阈值，触发安全返回
      if (deltaX > threshold) {
        navigateBackOr(navigate, getFallbackPathForRoute(location.pathname, location.search), { location });
      }
      
      isSwiping.current = false;
    };

    swipeScope.addEventListener('touchstart', handleTouchStart, { passive: true });
    swipeScope.addEventListener('touchmove', handleTouchMove, { passive: true });
    swipeScope.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      swipeScope.removeEventListener('touchstart', handleTouchStart);
      swipeScope.removeEventListener('touchmove', handleTouchMove);
      swipeScope.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, threshold, navigate, location]);
}

const getSwipeScopeElement = (): HTMLElement | null => {
  if (typeof document === 'undefined') return null;
  return document.querySelector('[data-swipe-scope="main"]') as HTMLElement | null;
};

const isWithinSwipeScope = (target: HTMLElement, scope: HTMLElement) => {
  return scope.contains(target);
};

const shouldIgnoreSwipeStart = (target: HTMLElement) => {
  // 页面级开关：编辑中可临时禁用滑返，避免误触导致内容丢失
  if (typeof document !== 'undefined' && document.body.dataset.swipeBackDisabled === 'true') {
    return true;
  }

  // 输入法弹起时禁用，避免编辑时误触返回
  if (typeof window !== 'undefined' && window.visualViewport) {
    const viewportGap = window.innerHeight - window.visualViewport.height;
    if (viewportGap > 140) return true;
  }

  // 在输入控件或可编辑区域触摸时不触发返回
  if (target.closest('input, textarea, select, [contenteditable="true"]')) {
    return true;
  }
  const activeElement = document.activeElement as HTMLElement | null;
  if (activeElement?.matches('input, textarea, select, [contenteditable="true"]')) {
    return true;
  }

  // 文本选中场景禁用，避免阅读中误触返回
  const selection = window.getSelection?.();
  if (selection && selection.type === 'Range') {
    return true;
  }

  // 弹窗/抽屉/Sheet/Popover 等浮层开启时禁用
  if (document.querySelector(
    '[data-state="open"][role="dialog"], [data-state="open"][role="alertdialog"], [data-state="open"][data-radix-portal], [data-radix-popper-content-wrapper]'
  )) {
    return true;
  }

  // 轮播、横滑 Tabs、滑块等交互区内不触发返回，避免误触
  if (target.closest('[role="slider"], [data-orientation="horizontal"], .embla, [data-horizontal-scroll="true"]')) {
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
