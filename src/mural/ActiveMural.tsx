import { observer } from 'mobx-react-lite';

import { useStores } from '../store';
import { Rect } from '../utils';
import { Mural } from './Mural';

export const ActiveMural = observer(_ActiveMural);

function _ActiveMural({ ...passthrough }: {}) {
  const {
    muralStore: { activeMural, placeGeneration },
    uiStore: { previewGeneration },
  } = useStores();

  return (
    <Mural
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
