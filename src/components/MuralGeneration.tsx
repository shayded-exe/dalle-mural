import { Center, chakra } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { models } from '../store';
import { Generation } from './Generation';
import { MuralPlaceholder } from './MuralPlaceholder';

const _MuralGeneration = ({
  generation,
  isSelected,
  onSelect,
  onEdit,
  onPlace,
  ...passthrough
}: {
  generation: models.Generation | null;

  isSelected?: boolean;
  onSelect: () => void;

  onEdit: () => void;
  onPlace: () => void;
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
          onEdit={onEdit}
          onPlace={onPlace}
        />
      )}
    </Center>
  );
};

const pixelSize = `${models.Generation.DISPLAY_SIZE}px`;

export const MuralGeneration = chakra(observer(_MuralGeneration), {
  baseStyle: {
    width: pixelSize,
    height: pixelSize,
  },
});
