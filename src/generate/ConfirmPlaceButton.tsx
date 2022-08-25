import { CheckIcon } from '@chakra-ui/icons';
import { Button, chakra } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { useStores } from '../store';

export const ConfirmPlaceButton = chakra(observer(_ConfirmPlaceButton));

function _ConfirmPlaceButton({ ...passthrough }: {}) {
  const {
    uiStore: { canPlaceGeneration, placeGeneration },
  } = useStores();

  return !canPlaceGeneration ? null : (
    <Button
      onClick={placeGeneration}
      leftIcon={<CheckIcon />}
      iconSpacing={'1rem'}
      size={'lg'}
      colorScheme={'green'}
      boxShadow={'md'}
      {...passthrough}
    >
      place
    </Button>
  );
}
