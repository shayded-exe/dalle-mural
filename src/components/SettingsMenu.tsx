import { SettingsIcon } from '@chakra-ui/icons';
import {
  Button,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react';

import { useStores } from '../store';

const _SettingsMenu = ({}: {}) => {
  const {
    muralStore: { clearMural },
    clear: clearStore,
  } = useStores();

  return (
    <Popover placement={'top-end'}>
      <PopoverTrigger>
        <IconButton
          icon={<SettingsIcon />}
          aria-label={'Settings'}
        />
      </PopoverTrigger>
      <PopoverContent
        padding={4}
        gap={4}
      >
        <Button
          onClick={() => clearMural()}
          colorScheme='orange'
        >
          clear mural
        </Button>

        <Button
          onClick={() => clearStore()}
          colorScheme='red'
        >
          clear store
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export const SettingsMenu = _SettingsMenu;
