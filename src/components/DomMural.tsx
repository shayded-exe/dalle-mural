import { chakra, Flex } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { models, useStores } from '../store';
import { Coordinates } from '../utils';
import { MuralGeneration } from './MuralGeneration';
import { MuralTransformWrapper } from './MuralTransformWrapper';

export const DomMural = chakra(observer(_DomMural));

// TODO: Split into ActiveMural and Mural
function _DomMural({
  mural,
  className,
}: {
  mural: models.DomMural;
  className?: string;
}) {
  const {
    muralStore: { selectedTile, selectTile, place },
    uiStore: { isInpaintPanelOpen, previewGeneration, loadInpaintPromptImage },
  } = useStores();

  const overlapMargin = `-${mural.overlap * models.Generation.DISPLAY_SIZE}px`;

  const onSelectGeneration = async (coords: Coordinates) => {
    selectTile(coords);

    if (isInpaintPanelOpen) {
      await loadInpaintPromptImage(coords);
    }
  };

  return (
    <MuralTransformWrapper className={className}>
      {mural.generations.map((col, x) => (
        <Flex
          key={x}
          direction={'column'}
          _notFirst={{ marginLeft: overlapMargin }}
        >
          {col.map((generation, y) => (
            <MuralGeneration
              key={`${x}-${y}`}
              generation={generation}
              isSelected={x === selectedTile?.x && y === selectedTile.y}
              onSelect={() => onSelectGeneration({ x, y })}
              // onEdit={() => inpaint({ x, y })}
              onPlace={() => place({ generation: previewGeneration!, x, y })}
              _notFirst={{ marginTop: overlapMargin }}
            />
          ))}
        </Flex>
      ))}
    </MuralTransformWrapper>
  );
}
