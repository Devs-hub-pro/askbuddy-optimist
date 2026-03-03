import React, { useEffect, useRef, useState } from 'react';
import { Plus } from 'lucide-react';

interface ChannelFloatingActionButtonProps {
  className: string;
  onClick?: () => void;
  ariaLabel?: string;
}

const BUTTON_SIZE = 56;
const EDGE_GAP = 16;
const BOTTOM_GAP = 96;

const ChannelFloatingActionButton: React.FC<ChannelFloatingActionButtonProps> = ({
  className,
  onClick,
  ariaLabel = '发布问题',
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStateRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });

  useEffect(() => {
    const syncInitialPosition = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setPosition({
        x: Math.max(EDGE_GAP, width - BUTTON_SIZE - EDGE_GAP),
        y: Math.max(EDGE_GAP + 56, height - BUTTON_SIZE - BOTTOM_GAP),
      });
    };

    syncInitialPosition();
    window.addEventListener('resize', syncInitialPosition);
    return () => window.removeEventListener('resize', syncInitialPosition);
  }, []);

  const clampPosition = (nextX: number, nextY: number) => {
    const maxX = Math.max(EDGE_GAP, window.innerWidth - BUTTON_SIZE - EDGE_GAP);
    const maxY = Math.max(EDGE_GAP + 56, window.innerHeight - BUTTON_SIZE - BOTTOM_GAP);

    return {
      x: Math.min(Math.max(EDGE_GAP, nextX), maxX),
      y: Math.min(Math.max(EDGE_GAP + 56, nextY), maxY),
    };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    dragStateRef.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragStateRef.current.active) return;

    const deltaX = event.clientX - dragStateRef.current.startX;
    const deltaY = event.clientY - dragStateRef.current.startY;
    const nextPosition = clampPosition(
      dragStateRef.current.originX + deltaX,
      dragStateRef.current.originY + deltaY,
    );

    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      dragStateRef.current.moved = true;
    }

    setPosition(nextPosition);
  };

  const handlePointerUp = () => {
    if (!dragStateRef.current.active) return;
    const shouldTriggerClick = !dragStateRef.current.moved;
    dragStateRef.current.active = false;

    if (shouldTriggerClick) {
      onClick?.();
    }
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={`fixed z-40 flex h-14 w-14 touch-none items-center justify-center rounded-full text-white ${className}`}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <Plus size={24} />
    </button>
  );
};

export default ChannelFloatingActionButton;
