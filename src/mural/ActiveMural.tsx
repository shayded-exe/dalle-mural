import { observer } from 'mobx-react-lite';

import { useStores } from '../store';
import { ImageDataUrl } from '../utils';
import { Mural } from './Mural';

export const ActiveMural = observer(_ActiveMural);

function _ActiveMural({ ...passthrough }: {}) {
  const {
    muralStore: { activeMural, setRasterizeFunc },
    uiStore: {
      previewGeneration,
      canSelect,
      selectionArea,
      setSelectionArea,
      selectArea,
      deselectArea,
    },
  } = useStores();

  return (
    <Mural
      mural={activeMural}
      canSelect={canSelect}
      selection={selectionArea}
      onSelectionChange={setSelectionArea}
      onSelect={selectArea}
      onDeselect={deselectArea}
      previewGeneration={previewGeneration}
      onCanvasInit={onCanvasInit}
      {...passthrough}
    />
  );

  function onCanvasInit(canvas: HTMLCanvasElement) {
    setRasterizeFunc(() => canvas.toDataURL() as ImageDataUrl);
  }
}
