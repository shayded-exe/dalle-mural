import { DependencyList, useCallback, useEffect, useState } from 'react';

import { getCanvasMouseCoordinates } from '../canvas';
import { Dimensions, Rect } from '../utils';

type AdjustFunc = (rect: Rect) => Rect;

export function useMouseRectSelection({
  canSelect,
  onSelectionChange,
  onSelect,
  onDeselect,
  dimensions,
  adjust,
}: {
  canSelect: boolean;
  onSelectionChange: (rect: Rect | null) => void;
  onSelect: () => void;
  onDeselect: () => void;
  dimensions: Dimensions;
  adjust?: AdjustFunc;
}) {
  const [selection, _setSelection] = useState<Rect | null>(null);
  const setSelection = (rect: Rect | null) => {
    _setSelection(rect);
    onSelectionChange(rect);
  };

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
    deps: [moveStartTime, isSelected],
    canSelect,
    dimensions,
    adjust,
  });

  const onMouseDown = useCallback(() => setMoveStartTime(undefined), []);

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
    deps: [moveStartTime, isSelected, onSelect, onDeselect],
    canSelect,
    dimensions,
    adjust,
  });

  useEffect(
    function updateDimensions() {
      if (selection) {
        setSelection({
          ...selection,
          ...dimensions,
        });
      }
    },
    [dimensions],
  );

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
    selectionEvents: {
      onMouseMove,
      onMouseDown,
      onMouseUp,
    },
  };
}

function useMouseRectCallback({
  callback,
  deps = [],
  canSelect,
  dimensions,
  adjust,
}: {
  callback: (rect: Rect) => void;
  deps?: DependencyList;
  canSelect: boolean;
  dimensions: Dimensions;
  adjust?: AdjustFunc;
}) {
  return useCallback(
    (e: React.MouseEvent) => {
      if (canSelect && e.button === 0) {
        const rect = getSelectionRectFromMouse({ e, dimensions, adjust });
        callback(rect);
      }
    },
    [canSelect, dimensions, adjust, ...deps],
  );
}

function getSelectionRectFromMouse({
  e,
  dimensions: { width, height },
  adjust,
}: {
  e: React.MouseEvent;
  dimensions: Dimensions;
  adjust?: AdjustFunc;
}): Rect {
  const { x, y } = getCanvasMouseCoordinates(e);

  let rect: Rect = {
    x: x - width / 2,
    y: y - height / 2,
    width,
    height,
  };

  if (adjust) {
    rect = adjust(rect);
  }

  return rect;
}
