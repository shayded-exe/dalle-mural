import { observer } from 'mobx-react-lite';
import { MouseEvent, useCallback, useEffect, useState } from 'react';

import { getCanvasMouseCoordinates } from '../canvas';
import { ZStack } from '../components/ZStack';
import { models } from '../store';
import { ImageDataUrl, Rect } from '../utils';
import { GridLayer } from './GridLayer';
import { MainLayer } from './MainLayer';
import { SelectionLayer } from './SelectionLayer';

export interface MuralHandle {
  rasterize(): ImageDataUrl;
}

export const Mural = observer(_Mural);

function _Mural({
  mural,
  isGridVisible = true,
  isSelecting = false,
  onSelect,
  previewGeneration,
  onCanvasInit,
  ...passthrough
}: {
  mural: models.Mural;
  isGridVisible?: boolean;
  isSelecting: boolean;
  onSelect: (rect: Rect) => void;
  previewGeneration: models.Generation | null;
  onCanvasInit?: (canvas: HTMLCanvasElement) => void;
}) {
  const {
    //
    selection,
    setSelectionFromMouse,
    selectFromMouse,
  } = useSelection({ isSelecting, onSelect });

  return (
    <ZStack
      width={mural.width}
      height={mural.height}
      onMouseDown={selectFromMouse}
      onMouseMove={setSelectionFromMouse}
      {...passthrough}
    >
      <MainLayer
        mural={mural}
        onCanvasInit={onCanvasInit}
      />
      <GridLayer mural={mural} />
      <SelectionLayer
        selection={selection}
        previewGeneration={previewGeneration}
      />
    </ZStack>
  );
}

function useSelection({
  isSelecting,
  onSelect,
}: {
  isSelecting: boolean;
  onSelect: (rect: Rect) => void;
}) {
  const [selection, setSelection] = useState<Rect | null>(null);

  const setSelectionFromMouse = useMouseRectCallback({
    callback: setSelection,
    isSelecting,
  });
  const selectFromMouse = useMouseRectCallback({
    callback: onSelect,
    isSelecting,
  });

  useEffect(() => {
    if (!isSelecting) {
      setSelection(null);
    }
  }, [isSelecting]);

  return {
    selection,
    setSelectionFromMouse,
    selectFromMouse,
  };

  function useMouseRectCallback({
    callback,
    isSelecting,
  }: {
    callback: (e: Rect) => void;
    isSelecting: boolean;
  }) {
    return useCallback(
      (e: MouseEvent) => {
        if (isSelecting) {
          callback(getSelectionRectFromMouse(e));
        }
      },
      [callback, isSelecting],
    );
  }

  function getSelectionRectFromMouse(e: MouseEvent): Rect {
    const size = models.Generation.SIZE;
    const { x, y } = getCanvasMouseCoordinates(e);

    return {
      x: x - size / 2,
      y: y - size / 2,
      ...models.Generation.DIMENSIONS,
    };
  }
}
