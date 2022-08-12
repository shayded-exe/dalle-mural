import { chakra, Flex, Spacer } from '@chakra-ui/react';

import { AuthTokenSetting } from './AuthTokenSetting';
import { SettingsMenu } from './SettingsMenu';

export const SettingsToolbar = chakra(_SettingsToolbar);

function _SettingsToolbar({ ...passthrough }: {}) {
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
      <SettingsMenu />
    </Flex>
  );
}
