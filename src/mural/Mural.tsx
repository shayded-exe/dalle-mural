import { observer } from 'mobx-react-lite';
import {
  forwardRef,
  MouseEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

import { getCanvasMouseCoordinates, useCanvas } from '../canvas';
import { ZStack } from '../components/ZStack';
import { models } from '../store';
import { ImageDataUrl, Rect } from '../utils';
import { GridLayer } from './GridLayer';
import { MainLayer } from './MainLayer';
import { SelectionLayer } from './SelectionLayer';

export interface MuralHandle {
  rasterize(): ImageDataUrl;
}

interface MuralProps {
  mural: models.Mural;
  previewGeneration: models.Generation | null;
  isGridVisible?: boolean;
  isSelecting: boolean;
  onSelect: (rect: Rect) => void;
}

export const Mural = observer(
  forwardRef<MuralHandle, MuralProps>(
    (
      {
        mural,
        isGridVisible = true,
        isSelecting = false,
        onSelect,
        previewGeneration,
        ...passthrough
      },
      ref,
    ) => {
      const {
        //
        selection,
        setSelectionFromMouse,
        selectFromMouse,
      } = useSelection({ isSelecting, onSelect });

      const { ref: canvasRef, canvas } = useCanvas();

      useImperativeHandle(
        ref,
        () => ({
          rasterize() {
            return canvas?.toDataURL() as ImageDataUrl;
          },
        }),
        [canvas],
      );

      return (
        <ZStack
          width={mural.width}
          height={mural.height}
          onMouseDown={selectFromMouse}
          onMouseMove={setSelectionFromMouse}
          {...passthrough}
        >
          <MainLayer
            ref={canvasRef}
            mural={mural}
          />
          <GridLayer mural={mural} />
          <SelectionLayer
            selection={selection}
            previewGeneration={previewGeneration}
          />
        </ZStack>
      );
    },
  ),
);

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
