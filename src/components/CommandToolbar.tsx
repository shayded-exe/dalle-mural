import { Button, ButtonProps, chakra, Flex } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { CgErase } from 'react-icons/cg';

import { useStores } from '../store';
import { UIMode } from '../store/models';
import { CgIcon } from './CgIcon';

export const CommandToolbar = chakra(observer(_CommandToolbar));

function _CommandToolbar({ ...passthrough }: {}) {
  const {
    uiStore: { activateMode },
  } = useStores();

  const buttonProps: ButtonProps = {
    size: 'lg',
    width: 40,
    boxShadow: 'md',
  };

  return (
    <Flex
      gap={8}
      {...passthrough}
    >
      <Button
        onClick={() => activateMode(UIMode.Generate)}
        colorScheme={'blue'}
        {...buttonProps}
      >
        Generate
      </Button>

      <Button
        onClick={() => activateMode(UIMode.Inpaint)}
        colorScheme={'green'}
        {...buttonProps}
      >
        Inpaint
      </Button>

      <Button
        onClick={() => activateMode(UIMode.Erase)}
        leftIcon={<CgIcon as={CgErase} />}
        colorScheme={'red'}
        {...buttonProps}
      >
        erase
      </Button>
    </Flex>
  );
}
