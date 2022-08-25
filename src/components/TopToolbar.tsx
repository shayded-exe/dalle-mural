import { chakra, Flex, IconButton, Spacer } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { CgLogOut } from 'react-icons/cg';

import { OpenMuralsButton } from '../murals/OpenMuralsButton';
import { useStores } from '../store';
import { CgIcon } from './CgIcon';
import { SelectionInfo } from './SelectionInfo';

export const TopToolbar = chakra(observer(_TopToolbar));

function _TopToolbar({ ...passthrough }: {}) {
  const {
    dalleStore: { signOut },
    uiStore: { selectionArea },
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
      <SelectionInfo selection={selectionArea} />

      <OpenMuralsButton />

      <Spacer />

      <IconButton
        onClick={signOut}
        icon={<CgIcon as={CgLogOut} />}
        aria-label='sign out'
      />
    </Flex>
  );
}
