import { observer } from 'mobx-react-lite';
import { MouseEvent, useState } from 'react';

import { getCanvasMouseCoordinates } from '../canvas';
import { ZStack } from '../components/ZStack';
import { models } from '../store';
import { Rect } from '../utils';
import { GridLayer } from './GridLayer';
import { MainLayer } from './MainLayer';
import { SelectionLayer } from './SelectionLayer';

export const MuralCanvas = observer(_MuralCanvas);

function _MuralCanvas({
  mural,
  previewGeneration,
  isGridVisible = true,
  isSelecting = true,
  onSelect,
  ...passthrough
}: {
  mural: models.Mural;
  previewGeneration: models.Generation | null;
  isGridVisible?: boolean;
  isSelecting?: boolean;
  onSelect?: (rect: Rect) => void;
}) {
  const { selection, setSelectionFromMouse } = useSelection(isSelecting);

  return (
    <ZStack
      width={mural.width}
      height={mural.height}
      onMouseMove={setSelectionFromMouse}
      {...passthrough}
    >
      <MainLayer mural={mural} />
      <GridLayer mural={mural} />
      <SelectionLayer
        selection={selection}
        previewGeneration={previewGeneration}
      />
    </ZStack>
  );
}

function useSelection(isSelecting: boolean) {
  const [selection, setSelection] = useState<Rect | null>(null);

  function setSelectionFromMouse(e: MouseEvent) {
    if (!isSelecting) {
      setSelection(null);
      return;
    }

    const size = models.Generation.SIZE;
    const { x, y } = getCanvasMouseCoordinates(e);

    setSelection({
      x: x - size / 2,
      y: y - size / 2,
      width: size,
      height: size,
    });
  }

  return { selection, setSelectionFromMouse };
}
