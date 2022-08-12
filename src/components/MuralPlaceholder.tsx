import { AddIcon, CheckIcon, EditIcon } from '@chakra-ui/icons';
import { Center, chakra, IconButton } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { useStores } from '../store';
import { Generation } from './Generation';

function _MuralPlaceholder({
  isSelected,
  onSelect,
  onEdit,
  onPlace,
  ...passthrough
}: {
  isSelected?: boolean;
  onSelect?: () => void;

  onEdit: () => void;
  onPlace: () => void;
}) {
  const {
    generationStore: { selectedResult: previewGeneration },
  } = useStores();

  if (!previewGeneration) {
    isSelected = false;
  }

  return isSelected && previewGeneration ? (
    <Generation
      generation={previewGeneration}
      zIndex={'mural-preview'}
      outline={isSelected && 'solid 2px'}
      outlineColor={'blue.500'}
    >
      <IconButton
        onClick={onPlace}
        icon={<CheckIcon />}
        colorScheme={'green'}
        aria-label={'Place generation'}
      />
    </Generation>
  ) : (
    <Center
      onClick={isSelected ? onEdit : onSelect}
      cursor={'pointer'}
      zIndex={'mural-background'}
      outline={'solid 1px'}
      outlineColor={isSelected ? 'blackAlpha.600' : 'blackAlpha.200'}
      _hover={{ outlineColor: 'blackAlpha.800' }}
      {...passthrough}
    >
      {previewGeneration ? <AddIcon opacity={0.5} /> : <EditIcon />}
    </Center>
  );
}

export const MuralPlaceholder = chakra(observer(_MuralPlaceholder), {
  baseStyle: {
    width: '100%',
    height: '100%',
  },
});
