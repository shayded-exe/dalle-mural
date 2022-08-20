import { observer } from 'mobx-react-lite';

import { useStores } from '../store';
import { Mural } from './Mural';

export const ActiveMural = observer(_ActiveMural);

function _ActiveMural({ ...passthrough }: {}) {
  const {
    muralStore: { activeMural },
    uiStore: {
      canSelectArea,
      selectionArea,
      setSelectionArea,
      selectArea,
      deselectArea,
      selectedGeneration,
      setCanvas,
    },
  } = useStores();

  return (
    <Mural
      mural={activeMural}
      canSelect={canSelectArea}
      selection={selectionArea}
      onSelectionChange={setSelectionArea}
      onSelect={selectArea}
      onDeselect={deselectArea}
      selectedGeneration={selectedGeneration}
      onCanvasInit={setCanvas}
      {...passthrough}
    />
  );
}
