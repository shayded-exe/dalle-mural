import React, { DependencyList, useCallback, useEffect, useState } from 'react';

import {
  Brush,
  BrushSize,
  Circle,
  getCanvasMouseCoordinates,
  isBrushCircle,
  Rect,
} from '../canvas';
import { useMouseCallback } from '../utils';

type AdjustFunc = (coords: Brush) => Brush;

export function useMouseBrush({
  canPaint,
  size,
  onPaintStart,
  onPaintEnd,
  adjustPosition,
}: {
  canPaint: boolean;
  size: BrushSize;
  onPaintStart?: (brush: Brush) => void;
  onPaintEnd?: () => void;
  adjustPosition?: AdjustFunc;
}) {
  const [brush, setBrush] = useState<Brush | null>(null);

  const [isPainting, _setIsPainting] = useState(false);
  const setIsPainting = (value: boolean) => {
    _setIsPainting(value);

    if (value) {
      onPaintStart?.(brush!);
    } else {
      onPaintEnd?.();
    }
  };

  const onMouseMove = useMouseBrushCallback({
    callback: brush => {
      setBrush(brush);
    },
    deps: [],
    canPaint,
    size,
    adjustPosition,
  });

  const onMouseDown = useMouseCallback({
    callback: () => setIsPainting(true),
    button: 0,
    deps: [],
  });

  const onMouseUp = useCallback(() => setIsPainting(false), []);

  useEffect(updateSize, [size]);
  useEffect(resetBrush, [canPaint, isPainting]);

  return {
    brush,
    isPainting,
    events: {
      onMouseMove,
      onMouseDown,
      onMouseUp,
    },
  } as const;

  function resetBrush() {
    if (!canPaint) {
      setBrush(null);

      if (isPainting) {
        setIsPainting(false);
      }
    }
  }

  function updateSize() {
    if (brush) {
      setBrush({
        x: brush.x,
        y: brush.y,
        ...size,
      });
    }
  }
}

function useMouseBrushCallback({
  callback,
  deps,
  canPaint,
  size,
  adjustPosition,
}: {
  callback: (brush: Brush) => void;
  deps: DependencyList;
  canPaint: boolean;
  size: BrushSize;
  adjustPosition?: AdjustFunc;
}) {
  return useMouseCallback({
    callback: e => {
      if (canPaint) {
        let brush = getBrushFromMouse(e, size);
        if (adjustPosition) {
          brush = adjustPosition(brush);
        }
        callback(brush);
      }
    },
    button: 0,
    deps: [canPaint, size, adjustPosition, ...deps],
  });
}

function getBrushFromMouse(e: React.MouseEvent, size: BrushSize): Brush {
  const { x, y } = getCanvasMouseCoordinates(e);

  if (isBrushCircle(size)) {
    return {
      x,
      y,
      radius: size.radius,
    } as Circle;
  } else {
    const { width, height } = size;

    return {
      x: x - width / 2,
      y: y - height / 2,
      width,
      height,
    } as Rect;
  }
}
