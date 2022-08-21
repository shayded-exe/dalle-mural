import { observer } from 'mobx-react-lite';

import { ZStack } from '../components/ZStack';
import { models } from '../store';
import { Dimensions, Rect } from '../utils';
import { GridLayer } from './GridLayer';
import { MainLayer } from './MainLayer';
import { SelectionLayer } from './SelectionLayer';
import { useMouseRectSelection } from './use-mouse-rect-selection';

export const Mural = observer(_Mural);

function _Mural({
  mural,
  isGridVisible = true,
  canSelect = false,
  selectionDimensions,
  onSelectionChange,
  onSelect,
  onDeselect,
  selectedGeneration,
  onCanvasInit,
  ...passthrough
}: {
  mural: models.Mural;
  isGridVisible?: boolean;
  canSelect: boolean;
  selectionDimensions: Dimensions;
  onSelectionChange: (rect: Rect | null) => void;
  onSelect: () => void;
  onDeselect: () => void;
  selectedGeneration: models.Generation | null;
  onCanvasInit?: (canvas: HTMLCanvasElement) => void;
}) {
  const {
    //
    selection,
    isSelected,
    selectionEvents,
  } = useMouseRectSelection({
    canSelect,
    onSelectionChange,
    onSelect,
    onDeselect,
    dimensions: selectionDimensions,
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
        selectedGeneration={selectedGeneration}
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
