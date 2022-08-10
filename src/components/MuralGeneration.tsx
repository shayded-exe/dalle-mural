import { Center, chakra } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { models } from '../store';
import { Generation } from './Generation';
import { MuralPlaceholder } from './MuralPlaceholder';

const _MuralGeneration = ({
  generation,
  isSelected = false,
  onSelect,
  onPlace,
  ...passthrough
}: {
  generation: models.Generation | null;
  isSelected?: boolean;

  onSelect?: () => void;
  onPlace: (generation: models.Generation) => void;

  className: string;
}) => {
  const isSaved = !!generation;

  return (
    <Center {...passthrough}>
      {isSaved ? (
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
};

const pixelSize = `${models.Generation.BASE_DISPLAY_SIZE}px`;

export const MuralGeneration = chakra(observer(_MuralGeneration), {
  baseStyle: {
    width: pixelSize,
    height: pixelSize,
  },
});
