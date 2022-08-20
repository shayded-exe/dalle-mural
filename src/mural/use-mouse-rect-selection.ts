import { useCallback, useEffect, useState } from 'react';

import { getCanvasMouseCoordinates } from '../canvas';
import { models } from '../store';
import { Rect } from '../utils';

type AdjustFunc = (rect: Rect) => Rect;

export function useMouseRectSelection({
  canSelect,
  onSelectionChange: setSelection,
  onSelect,
  onDeselect,
  adjust,
}: {
  canSelect: boolean;
  onSelectionChange: (rect: Rect | null) => void;
  onSelect: () => void;
  onDeselect: () => void;
  adjust?: AdjustFunc;
}) {
  const [isSelected, setIsSelected] = useState(false);

  const [moveStartTime, setMoveStartTime] = useState<number>();
  const MAX_MOVE_TIME_FOR_CLICK = 100;

  const onMouseMove = useMouseRectCallback({
    callback: rect => {
      if (!moveStartTime) {
        setMoveStartTime(Date.now());
      }
      if (!isSelected) {
        setSelection(rect);
      }
    },
    canSelect,
    adjust,
  });

  const onMouseDown = useMouseRectCallback({
    callback: () => setMoveStartTime(undefined),
    canSelect,
  });

  const onMouseUp = useMouseRectCallback({
    callback: () => {
      if (moveStartTime && moveStartTime + MAX_MOVE_TIME_FOR_CLICK < Date.now()) {
        return;
      }

      if (isSelected) {
        setIsSelected(false);
        onDeselect();
      } else {
        setIsSelected(true);
        onSelect();
      }
    },
    canSelect,
    adjust,
  });

  useEffect(
    function resetSelection() {
      if (!canSelect) {
        setSelection(null);
        setIsSelected(false);
      }
    },
    [canSelect],
  );

  return {
    isSelected,
    selectionEvents: {
      onMouseMove,
      onMouseDown,
      onMouseUp,
    },
  };
}

function useMouseRectCallback({
  callback,
  canSelect,
  adjust,
}: {
  callback: (rect: Rect) => void;
  canSelect: boolean;
  adjust?: AdjustFunc;
}) {
  return useCallback(
    (e: React.MouseEvent) => {
      if (canSelect && e.button === 0) {
        const rect = getSelectionRectFromMouse({ e, adjust });
        callback(rect);
      }
    },
    [callback, canSelect],
  );
}

function getSelectionRectFromMouse({
  e,
  adjust,
}: {
  e: React.MouseEvent;
  adjust?: AdjustFunc;
}): Rect {
  const size = models.Generation.SIZE;
  const { x, y } = getCanvasMouseCoordinates(e);

  let rect: Rect = {
    x: x - size / 2,
    y: y - size / 2,
    ...models.Generation.DIMENSIONS,
  };

  if (adjust) {
    rect = adjust(rect);
  }

  return rect;
}
