import { chakra, Flex } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { models, useStores } from '../store';
import { MuralGeneration } from './MuralGeneration';

export const MuralTransformWrapper = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <TransformWrapper
      minScale={0.25}
      centerOnInit={true}
      limitToBounds={false}
      panning={{ velocityDisabled: true }}
      doubleClick={{ mode: 'reset' }}
    >
      {() => (
        <>
          <TransformComponent
            contentStyle={{
              display: 'flex',
              flexDirection: 'row',
            }}
            wrapperStyle={{
              width: '100%',
              height: '100%',
            }}
            wrapperClass={className}
          >
            {children}
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
};

// TODO: Split into ActiveMural and Mural
const _Mural = ({
  mural,
  className,
}: {
  mural: models.Mural;
  className?: string;
}) => {
  const {
    muralStore: { selectedTile, selectTile, place },
    uiStore: { isInpaintPanelOpen, selectedResultId, loadInpaintPromptImage },
  } = useStores();

  const overlapMargin = `-${mural.overlap * models.Generation.DISPLAY_SIZE}px`;

  const onSelectGeneration = async (coords: models.MuralCoords) => {
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
              onPlace={() => place({ generationId: selectedResultId!, x, y })}
              _notFirst={{ marginTop: overlapMargin }}
            />
          ))}
        </Flex>
      ))}
    </MuralTransformWrapper>
  );
};

export const Mural = chakra(observer(_Mural));
