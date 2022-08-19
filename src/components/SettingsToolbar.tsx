import { RepeatClockIcon } from '@chakra-ui/icons';
import { chakra, Flex, IconButton, Spacer } from '@chakra-ui/react';

import { useStores } from '../store';
import { AuthTokenSetting } from './AuthTokenSetting';
import { SettingsMenu } from './SettingsMenu';

export const SettingsToolbar = chakra(_SettingsToolbar);

function _SettingsToolbar({ ...passthrough }: {}) {
  const {
    muralStore: { undo },
  } = useStores();

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
      <SettingsMenu />
    </Flex>
  );
}
