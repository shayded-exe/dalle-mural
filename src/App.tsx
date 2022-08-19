import { Center, Flex, Spacer, Spinner } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { CommandToolbar } from './components/CommandToolbar';
import { GeneratePanel } from './generate/GeneratePanel';
import { SettingsToolbar } from './components/SettingsToolbar';
import { ActiveMural } from './mural/ActiveMural';
import { MuralTransformWrapper } from './mural/MuralTransformWrapper';
import { useStores } from './store';

export const App = observer(() => {
  const {
    uiStore: { isPanelOpen, isGeneratePanelOpen, isInpaintPanelOpen },
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
        zIndex={'docked'}
      />

      <Spacer />

      {!isGeneratePanelOpen ? null : (
        <GeneratePanel
          minWidth={'min-content'}
          maxWidth={'70rem'}
          margin={'2rem'}
          zIndex={'docked'}
        />
      )}

      {isPanelOpen ? null : (
        <CommandToolbar
          margin='2rem'
          zIndex={'docked'}
        />
      )}

      <MuralTransformWrapper position={'absolute'}>
        <ActiveMural />
      </MuralTransformWrapper>
    </Flex>
  );
});
