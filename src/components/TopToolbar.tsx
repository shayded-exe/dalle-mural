import { chakra, Flex, IconButton, Spacer } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { CgLogOut, CgSoftwareDownload, CgUndo } from 'react-icons/cg';

import { OpenMuralsButton } from '../murals/OpenMuralsButton';
import { useStores } from '../store';
import { downloadImage } from '../utils';
import { CgIcon } from './CgIcon';
import { SelectionInfo } from './SelectionInfo';

export const TopToolbar = chakra(observer(_TopToolbar));

function _TopToolbar({ ...passthrough }: {}) {
  const {
    dalleStore: { signOut },
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

      <OpenMuralsButton />

      <Spacer />

      <IconButton
        onClick={undo}
        icon={<CgIcon as={CgUndo} />}
        aria-label='undo'
      />

      <IconButton
        onClick={onRasterizeClick}
        icon={<CgIcon as={CgSoftwareDownload} />}
        aria-label='download'
      />

      <IconButton
        onClick={signOut}
        icon={<CgIcon as={CgLogOut} />}
        aria-label='sign out'
      />
    </Flex>
  );
}
