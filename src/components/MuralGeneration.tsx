import { Center, chakra } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { models } from '../store';
import { Generation } from './Generation';
import { MuralPlaceholder } from './MuralPlaceholder';

const pixelSize = `${models.Generation.DISPLAY_SIZE}px`;

export const MuralGeneration = chakra(observer(_MuralGeneration), {
  baseStyle: {
    width: pixelSize,
    height: pixelSize,
  },
});

function _MuralGeneration({
  generation,

  isSelected,
  onSelect,

  onPlace,
  ...passthrough
}: {
  generation: models.Generation | null;

  isSelected: boolean;
  onSelect: () => void;

  onPlace: () => void;
}) {
  const isPlaced = !!generation;

  return (
    <Center {...passthrough}>
      {isPlaced ? (
        <Generation
          generation={generation}
          zIndex={'mural-placed'}
        />
      ) : (
        <MuralPlaceholder
          isSelected={isSelected}
          onSelect={onSelect}
          onPlace={onPlace}
        />
      )}
    </Center>
  );
}
