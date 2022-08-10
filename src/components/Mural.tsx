import './Mural.css';

import { chakra, Flex } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { models, useStores } from '../store';
import { MuralGeneration } from './MuralGeneration';

interface Props {
  mural: models.Mural;
  className?: string;
}

const _Mural = ({ mural, className }: Props) => {
  const {
    muralStore: { selectedTile, selectTile, inpaint, place },
    generationStore: { selectedResultId },
  } = useStores();

  const overlapMargin = `-${mural.overlap * models.Generation.DISPLAY_SIZE}px`;

  return (
    <div className={className}>
      <TransformWrapper
        minScale={0.25}
        centerOnInit={true}
        limitToBounds={false}
        panning={{ velocityDisabled: true }}
        doubleClick={{ mode: 'reset' }}
      >
        <TransformComponent
          contentStyle={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
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
                  onSelect={() => selectTile({ x, y })}
                  onEdit={() => inpaint({ x, y })}
                  onPlace={() =>
                    place({ generationId: selectedResultId!, x, y })
                  }
                  _notFirst={{ marginTop: overlapMargin }}
                />
              ))}
            </Flex>
          ))}
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export const Mural = chakra(observer(_Mural), {
  baseStyle: {
    minWidth: 0,
    minHeight: 0,
  },
  shouldForwardProp: () => true,
});
