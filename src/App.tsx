import { Center, Flex, Spinner } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { Mural } from './components';
import { CommandToolbar } from './components/CommandToolbar';
import { GeneratePanel } from './components/GeneratePanel';
import { InpaintPanel } from './components/InpaintPanel';
import { SettingsToolbar } from './components/SettingsToolbar';
import { useStores } from './store';

export const App = observer(() => {
  const {
    muralStore: { activeMural },
    uiStore: { isGeneratePanelOpen, isInpaintPanelOpen },
    isHydrated,
  } = useStores();

  if (!isHydrated) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <Flex
      position={'relative'}
      direction={'column'}
      align={'center'}
      justify={'space-between'}
      width='100vw'
      height='100vh'
    >
      <SettingsToolbar
        margin='2rem'
        width='calc(100% - 4rem)'
        maxWidth='80rem'
        zIndex={'overlay'}
      />

      {!isGeneratePanelOpen ? null : (
        <GeneratePanel
          minWidth={'min-content'}
          maxWidth={'30%'}
          alignSelf={'start'}
          zIndex={'docked'}
        />
      )}

      {!isInpaintPanelOpen ? null : (
        <InpaintPanel
          minWidth={'min-content'}
          maxWidth={'30%'}
          alignSelf={'end'}
          zIndex={'docked'}
        />
      )}

      <CommandToolbar
        margin='2rem'
        zIndex={'overlay'}
      />

      <Mural
        mural={activeMural}
        position={'absolute'}
      />
    </Flex>
  );
});
