import { useCallback, useEffect, useState } from 'react';

import { getCanvasMouseCoordinates } from '../canvas';
import { models } from '../store';
import { Rect } from '../utils';

type AdjustFunc = (rect: Rect) => Rect;

export function useSelection({
  canSelect,
  onSelect,
  onDeselect,
  adjust,
}: {
  canSelect: boolean;
  onSelect: (rect: Rect) => void;
  onDeselect: () => void;
  adjust?: AdjustFunc;
}) {
  const [selection, setSelection] = useState<Rect | null>(null);
  const [isSelected, setIsSelected] = useState(false);

  const setSelectionFromMouse = useMouseRectCallback({
    callback: rect => {
      if (!isSelected) {
        setSelection(rect);
      }
    },
    canSelect,
    adjust,
  });

  const toggleIsSelectedFromMouse = useMouseRectCallback({
    callback: rect => {
      if (isSelected) {
        setIsSelected(false);
        onDeselect();
      } else {
        setIsSelected(true);
        onSelect(rect);
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
    selection,
    isSelected,
    setSelectionFromMouse,
    toggleIsSelectedFromMouse,
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
