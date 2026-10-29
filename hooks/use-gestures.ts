"use client";

import { useCallback, useRef } from "react";

type SwipeDirection = "up" | "down" | "left" | "right";

type SwipeHandlers = Partial<Record<SwipeDirection, () => void>>;

export function useSwipe(handlers: SwipeHandlers, threshold = 56) {
  const start = useRef<{ x: number; y: number; t: number } | null>(null);

  const onTouchStart = useCallback((event: React.TouchEvent) => {
    const touch = event.touches[0];
    start.current = { x: touch.clientX, y: touch.clientY, t: Date.now() };
  }, []);

  const onTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      const origin = start.current;
      start.current = null;
      if (!origin) return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - origin.x;
      const dy = touch.clientY - origin.y;
      if (Date.now() - origin.t > 600) return;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < threshold) return;
      const direction: SwipeDirection =
        Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
      handlers[direction]?.();
    },
    [handlers, threshold],
  );

  return { onTouchStart, onTouchEnd };
}

export function useLongPress(onLongPress: () => void, delay = 480) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fired = useRef(false);

  const clear = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }, []);

  const onPointerDown = useCallback(() => {
    fired.current = false;
    clear();
    timer.current = setTimeout(() => {
      fired.current = true;
      onLongPress();
    }, delay);
  }, [clear, delay, onLongPress]);

  const onClickCapture = useCallback((event: React.MouseEvent) => {
    if (fired.current) {
      event.preventDefault();
      event.stopPropagation();
      fired.current = false;
    }
  }, []);

  return {
    onPointerDown,
    onPointerUp: clear,
    onPointerLeave: clear,
    onPointerCancel: clear,
    onClickCapture,
    onContextMenu: (event: React.MouseEvent) => event.preventDefault(),
  };
}
