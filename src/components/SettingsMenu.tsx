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
    muralStore: { activeMural },
    clear: clearStore,
  } = useStores();

  const rasterize = async () => {
    // const image = await models.Mural.rasterize(activeMural);
    // downloadImage(image);
  };

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
        <Button onClick={rasterize}>Rasterize</Button>

        <Button
          onClick={() => clearStore()}
          colorScheme='red'
        >
          Clear store
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export const SettingsMenu = _SettingsMenu;
