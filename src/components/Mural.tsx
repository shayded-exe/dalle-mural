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
  const { muralStore } = useStores();

  const addGeneration = (x: number, y: number) => {
    // muralStore.
  };

  return (
    <div className={className}>
      <TransformWrapper
        minScale={0.25}
        centerOnInit={true}
        centerZoomedOut={true}
        limitToBounds={false}
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
              direction='column'
              className='mural-col'
            >
              {col.map((generation, y) => (
                <MuralGeneration
                  key={`${x}-${y}`}
                  generation={generation}
                  isSelected={
                    x === muralStore.selectedTile?.x &&
                    y === muralStore.selectedTile.y
                  }
                  onSelect={() => muralStore.selectTile({ x, y })}
                  onPlace={generation =>
                    muralStore.place({
                      generationId: generation.id,
                      x,
                      y,
                    })
                  }
                  className='mural-cell'
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
