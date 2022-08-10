import { AddIcon, CheckIcon } from '@chakra-ui/icons';
import { Center, chakra, IconButton } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { models, useStores } from '../store';
import { Generation } from './Generation';

const _MuralPlaceholder = ({
  isSelected,
  onSelect,
  onPlace,
  ...passthrough
}: {
  isSelected?: boolean;
  onSelect?: () => void;

  onPlace: (generation: models.Generation) => void;
}) => {
  const { generationStore } = useStores();
  const previewGeneration = generationStore.selectedResult;

  return isSelected && previewGeneration ? (
    <Generation
      generation={previewGeneration}
      isSelected={isSelected}
      zIndex={'mural-preview'}
    >
      <IconButton
        onClick={() => onPlace(previewGeneration)}
        icon={<CheckIcon />}
        colorScheme={'green'}
        aria-label={'Place generation'}
      />
    </Generation>
  ) : (
    <Center
      onClick={onSelect}
      cursor={'pointer'}
      zIndex={'mural-background'}
      outlineColor={'blackAlpha.800'}
      _hover={{ outline: 'solid 1px' }}
      {...passthrough}
    >
      <AddIcon />
    </Center>
  );
};

export const MuralPlaceholder = chakra(observer(_MuralPlaceholder), {
  baseStyle: {
    width: '100%',
    height: '100%',
  },
});
