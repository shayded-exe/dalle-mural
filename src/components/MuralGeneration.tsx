import { AddIcon } from '@chakra-ui/icons';
import { Button, chakra, VStack } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { models, useStores } from '../store';
import { Generation } from './Generation';

const _MuralGeneration = ({
  generation,
  isSelected = false,
  onSelect,
  ...passthrough
}: {
  generation: models.Generation | null;
  isSelected?: boolean;

  onSelect?: () => void;
}) => {
  const { generationStore } = useStores();

  if (isSelected) {
    generation = generationStore.selectedResult;
  }

  return generation == null ? (
    <VStack
      justify='center'
      spacing='4'
      onClick={onSelect}
      cursor='pointer'
      {...passthrough}
    >
      <Button
        rightIcon={<AddIcon />}
        size='lg'
      >
        Add
      </Button>
    </VStack>
  ) : (
    <Generation
      generation={generation}
      isSelected={isSelected}
      onSelect={onSelect}
      {...passthrough}
    ></Generation>
  );
};

const pixelSize = `${models.Generation.BASE_DISPLAY_SIZE}px`;

export const MuralGeneration = chakra(observer(_MuralGeneration), {
  baseStyle: {
    width: pixelSize,
    height: pixelSize,
  },
});
