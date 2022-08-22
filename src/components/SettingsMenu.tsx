import {
  Button,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react';
import { CgOptions } from 'react-icons/cg';

import { useStores } from '../store';
import { CgIcon } from './CgIcon';

export function SettingsMenu() {
  const {
    muralStore: { clearMural },
    clear: clearStore,
  } = useStores();

  return (
    <Popover placement={'top-end'}>
      <PopoverTrigger>
        <IconButton
          icon={<CgIcon as={CgOptions} />}
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
}
