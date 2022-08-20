import { DownloadIcon, RepeatClockIcon } from '@chakra-ui/icons';
import { chakra, Flex, IconButton, Spacer } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { useStores } from '../store';
import { downloadImage } from '../utils';
import { AuthTokenSetting } from './AuthTokenSetting';
import { SelectionInfo } from './SelectionInfo';
import { SettingsMenu } from './SettingsMenu';

export const SettingsToolbar = chakra(observer(_SettingsToolbar));

function _SettingsToolbar({ ...passthrough }: {}) {
  const {
    muralStore: { undo },
    uiStore: { selectionArea, rasterize },
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
      <SelectionInfo selection={selectionArea} />
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
      <AuthTokenSetting />
      <SettingsMenu />
    </Flex>
  );
}
