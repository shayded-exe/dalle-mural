import { observer } from 'mobx-react-lite';

import { useStores } from '../store';
import { Mural } from './Mural';

export const ActiveMural = observer(_ActiveMural);

function _ActiveMural({ ...passthrough }: {}) {
  const {
    muralStore: { activeMural },
    uiStore: {
      canSelectArea,
      setSelectionArea,
      selectArea,
      deselectArea,
      selectedGeneration,
      canErase,
      eraseBrushSize,
      onEraseStart,
      setMuralRef,
    },
  } = useStores();

  return (
    <Mural
      mural={activeMural}
      canSelect={canSelectArea}
      onSelectionChange={setSelectionArea}
      onSelect={selectArea}
      onDeselect={deselectArea}
      selectedGeneration={selectedGeneration}
      canErase={canErase}
      eraseBrushSize={eraseBrushSize}
      onEraseStart={onEraseStart}
      muralRef={setMuralRef}
      {...passthrough}
    />
  );
}
