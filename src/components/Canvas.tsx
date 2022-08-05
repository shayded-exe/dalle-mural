import { chakra } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { useStore } from '../store';
import { Generation } from './Generation';

interface Props {
  className?: string;
}

const _Canvas = ({ className }: Props) => {
  const { placedGenerations } = useStore();

  return (
    <div className={className}>
      <TransformWrapper>
        <TransformComponent>
          {placedGenerations.map(generation => (
            <Generation
              key={generation.id}
              generation={generation}
            ></Generation>
          ))}
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export const Canvas = chakra(observer(_Canvas), {
  shouldForwardProp: () => true,
});
