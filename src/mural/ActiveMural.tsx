import { observer } from 'mobx-react-lite';

import { canvasToImage } from '../canvas';
import { useStores } from '../store';
import { Mural } from './Mural';

export const ActiveMural = observer(_ActiveMural);

function _ActiveMural({ ...passthrough }: {}) {
  const {
    muralStore: { hasActiveMural, activeMural, setPreviewImage },
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

  return !hasActiveMural ? (
    <div> </div>
  ) : (
    <Mural
      mural={activeMural!}
      canSelect={canSelectArea}
      onSelectionChange={setSelectionArea}
      onSelect={selectArea}
      onDeselect={deselectArea}
      selectedGeneration={selectedGeneration}
      canErase={canErase}
      eraseBrushSize={eraseBrushSize}
      onEraseStart={onEraseStart}
      onPaint={onPaintUpdatePreviewImage}
      muralRef={setMuralRef}
      {...passthrough}
    />
  );

  function onPaintUpdatePreviewImage(ctx: CanvasRenderingContext2D) {
    // needed to not block the final canvas draw for some reason
    setTimeout(() => {
      const image = canvasToImage(ctx);
      setPreviewImage(image);
    });
  }
}
