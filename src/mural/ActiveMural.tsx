import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';

import { useStores } from '../store';
import { Rect } from '../utils';
import { Mural, MuralHandle } from './Mural';

export const ActiveMural = observer(_ActiveMural);

function _ActiveMural({ ...passthrough }: {}) {
  const {
    muralStore: { activeMural, placeGeneration, setRasterizeFunc },
    uiStore: { previewGeneration },
  } = useStores();

  const ref = useCallback((muralHandle: MuralHandle | null) => {
    if (muralHandle) {
      setRasterizeFunc(muralHandle.rasterize);
    }
  }, []);

  return (
    <Mural
      ref={ref}
      mural={activeMural}
      isSelecting={!!previewGeneration}
      onSelect={onSelect}
      previewGeneration={previewGeneration}
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
