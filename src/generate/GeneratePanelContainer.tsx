import { CheckIcon } from '@chakra-ui/icons';
import { Button, chakra, Flex } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';

import { useStores } from '../store';

export const GeneratePanelContainer = chakra(observer(_GeneratePanelContainer));

function _GeneratePanelContainer({
  children,
  ...passthrough
}: {
  children: ReactNode;
}) {
  const {
    uiStore: { canPlaceGeneration, placeGeneration },
  } = useStores();

  return (
    <Flex
      direction={'column'}
      gap={4}
      {...passthrough}
    >
      {canPlaceGeneration && <ConfirmPlaceButton />}

      <Flex
        direction={'column'}
        gap={4}
        padding={4}
        minHeight={0}
        background={'white'}
        boxShadow={'lg'}
        borderRadius={'lg'}
      >
        {children}
      </Flex>
    </Flex>
  );

  function ConfirmPlaceButton() {
    return (
      <Button
        onClick={placeGeneration}
        rightIcon={<CheckIcon />}
        iconSpacing={4}
        size={'lg'}
        colorScheme={'green'}
        alignSelf={'end'}
        boxShadow={'md'}
      >
        Place
      </Button>
    );
  }
}
