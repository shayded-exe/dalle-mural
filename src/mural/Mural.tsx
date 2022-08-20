import { observer } from 'mobx-react-lite';
import React from 'react';

import { ZStack } from '../components/ZStack';
import { models } from '../store';
import { ImageDataUrl, Rect } from '../utils';
import { GridLayer } from './GridLayer';
import { MainLayer } from './MainLayer';
import { SelectionLayer } from './SelectionLayer';
import { useMouseRectSelection } from './use-mouse-rect-selection';

export interface MuralHandle {
  rasterize(): ImageDataUrl;
}

export const Mural = observer(_Mural);

function _Mural({
  mural,
  isGridVisible = true,
  canSelect = false,
  onSelect,
  onDeselect,
  previewGeneration,
  onCanvasInit,
  ...passthrough
}: {
  mural: models.Mural;
  isGridVisible?: boolean;
  canSelect: boolean;
  onSelect: (rect: Rect) => void;
  onDeselect: () => void;
  previewGeneration: models.Generation | null;
  onCanvasInit?: (canvas: HTMLCanvasElement) => void;
}) {
  const {
    //
    selection,
    isSelected,
    selectionEvents,
  } = useMouseRectSelection({
    canSelect,
    onSelect,
    onDeselect,
    adjust: rect =>
      snapToGrid({
        rect,
        subdivideRatio: mural.gridSubdivideRatio,
      }),
  });

  return (
    <ZStack
      width={mural.width}
      height={mural.height}
      {...selectionEvents}
      {...passthrough}
    >
      <MainLayer
        mural={mural}
        onCanvasInit={onCanvasInit}
      />
      <GridLayer mural={mural} />
      <SelectionLayer
        selection={selection}
        isSelected={isSelected}
        previewGeneration={previewGeneration}
      />
    </ZStack>
  );
}

function snapToGrid({
  rect,
  subdivideRatio,
}: {
  rect: Rect;
  subdivideRatio: number;
}): Rect {
  const squareSize = models.Generation.SIZE * subdivideRatio;

  return {
    ...rect,
    x: snapValue(rect.x),
    y: snapValue(rect.y),
  };

  function snapValue(value: number): number {
    return value - (value % squareSize);
  }
}
