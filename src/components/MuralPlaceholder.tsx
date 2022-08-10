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
      zIndex={'mural-preview'}
      outline={isSelected && 'solid 2px'}
      outlineColor={'blue.500'}
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
      outline={'solid 1px'}
      outlineColor={isSelected ? 'blackAlpha.600' : 'blackAlpha.200'}
      _hover={{ outlineColor: 'blackAlpha.800' }}
      {...passthrough}
    >
      <AddIcon opacity={0.5} />
    </Center>
  );
};

export const MuralPlaceholder = chakra(observer(_MuralPlaceholder), {
  baseStyle: {
    width: '100%',
    height: '100%',
  },
});
