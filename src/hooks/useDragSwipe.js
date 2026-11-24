import { useRef, useState, useCallback } from "react";

/**
 * Pointer-based drag / swipe for image carousels (mouse, touch and pen).
 * Spread `bind` on the draggable element, use `offset` to translate the image
 * while dragging, and `isDragging` to disable transitions during the drag.
 * Vertical page scrolling still works (touch-action: pan-y).
 */
export default function useDragSwipe({ onNext, onPrev, threshold = 50 }) {
  const startX = useRef(null);
  const moved = useRef(false);
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const onPointerDown = useCallback((e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    startX.current = e.clientX;
    moved.current = false;
    setIsDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 5) moved.current = true;
    setOffset(dx);
  }, []);

  const end = useCallback(
    (e) => {
      if (startX.current === null) return;
      const dx = e.clientX - startX.current;
      startX.current = null;
      setIsDragging(false);
      setOffset(0);
      if (dx <= -threshold) onNext?.();
      else if (dx >= threshold) onPrev?.();
    },
    [onNext, onPrev, threshold]
  );

  // Swallow the click that follows a drag so links/buttons underneath don't fire
  const onClickCapture = useCallback((e) => {
    if (moved.current) {
      e.preventDefault();
      e.stopPropagation();
      moved.current = false;
    }
  }, []);

  return {
    offset,
    isDragging,
    bind: {
      onPointerDown,
      onPointerMove,
      onPointerUp: end,
      onPointerCancel: end,
      onClickCapture,
      onDragStart: (e) => e.preventDefault(),
      style: { touchAction: "pan-y", cursor: isDragging ? "grabbing" : "grab", userSelect: "none" },
    },
  };
}
