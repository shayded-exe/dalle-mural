import { Button, chakra, Flex } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { useStores } from '../store';

export const CommandToolbar = chakra(observer(_CommandToolbar));

function _CommandToolbar({ ...passthrough }: {}) {
  const {
    uiStore: {
      openGeneratePanel: openGenerateWindow,
      openInpaintingPanel: openInpaintingWindow,
    },
  } = useStores();

  return (
    <Flex
      gap={8}
      {...passthrough}
    >
      <Button
        onClick={openGenerateWindow}
        size={'lg'}
        width={40}
        colorScheme={'blue'}
      >
        Generate
      </Button>
      <Button
        onClick={openInpaintingWindow}
        size={'lg'}
        width={40}
        colorScheme={'green'}
      >
        Inpaint
      </Button>
    </Flex>
  );
}
