import './Mural.css';

import { chakra } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { models } from '../store';
import { Generation } from './Generation';

interface Props {
  mural: models.Mural;
  className?: string;
}

const _Mural = ({ mural, className }: Props) => {
  return (
    <div className={className}>
      <TransformWrapper
        minScale={0.1}
        initialScale={0.25}
        initialPositionX={200}
        initialPositionY={200}
        // centerOnInit={true}
        // centerZoomedOut={true}
        limitToBounds={false}
      >
        <TransformComponent>
          {mural.generations.map(row =>
            row.map(generation =>
              generation == null ? null : (
                <Generation
                  key={generation.id}
                  generation={generation}
                ></Generation>
              ),
            ),
          )}
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
