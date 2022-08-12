import { AddIcon, CheckIcon } from '@chakra-ui/icons';
import { Center, chakra, IconButton } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { useStores } from '../store';
import { Generation } from './Generation';

export const MuralPlaceholder = chakra(observer(_MuralPlaceholder), {
  baseStyle: {
    width: '100%',
    height: '100%',
  },
});

function _MuralPlaceholder({
  isSelected,
  onSelect,

  onPlace,
  ...passthrough
}: {
  isSelected: boolean;
  onSelect: () => void;

  onPlace: () => void;
}) {
  const {
    uiStore: { isGeneratePanelOpen, isInpaintPanelOpen, previewGeneration },
  } = useStores();

  if (!isGeneratePanelOpen && !isInpaintPanelOpen) {
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
}
