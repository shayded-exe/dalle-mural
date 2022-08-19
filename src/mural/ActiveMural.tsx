import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';

import { useStores } from '../store';
import { ImageDataUrl, Rect } from '../utils';
import { Mural } from './Mural';

export const ActiveMural = observer(_ActiveMural);

function _ActiveMural({ ...passthrough }: {}) {
  const {
    muralStore: { activeMural, placeGeneration, setRasterizeFunc },
    uiStore: { previewGeneration },
  } = useStores();

  const onCanvasInit = useCallback((canvas: HTMLCanvasElement) => {
    setRasterizeFunc(() => canvas.toDataURL() as ImageDataUrl);
  }, []);

  return (
    <Mural
      mural={activeMural}
      isSelecting={!!previewGeneration}
      onSelect={onSelect}
      previewGeneration={previewGeneration}
      onCanvasInit={onCanvasInit}
      {...passthrough}
    />
  );

  function onSelect(rect: Rect) {
    if (previewGeneration) {
      placeGeneration({
        generation: previewGeneration,
        ...rect,
      });
    }
  }
}
