import { DownloadIcon, RepeatClockIcon } from '@chakra-ui/icons';
import { chakra, Flex, IconButton, Spacer } from '@chakra-ui/react';

import { useStores } from '../store';
import { downloadImage } from '../utils';
import { AuthTokenSetting } from './AuthTokenSetting';
import { SettingsMenu } from './SettingsMenu';

export const SettingsToolbar = chakra(_SettingsToolbar);

function _SettingsToolbar({ ...passthrough }: {}) {
  const {
    muralStore: { undo, rasterize },
  } = useStores();

  const onRasterizeClick = () => downloadImage(rasterize());

  return (
    <Flex
      pointerEvents={'none'}
      sx={{
        '& button': {
          pointerEvents: 'auto',
        },
      }}
      gap={4}
      {...passthrough}
    >
      <AuthTokenSetting />
      <Spacer />
      <IconButton
        onClick={undo}
        icon={<RepeatClockIcon />}
        aria-label={'Undo'}
      />
      <IconButton
        onClick={onRasterizeClick}
        icon={<DownloadIcon />}
        aria-label={'Download'}
      />
      <SettingsMenu />
    </Flex>
  );
}
