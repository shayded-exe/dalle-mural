import { Center, Flex, Spacer, Spinner } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { CommandToolbar } from './components/CommandToolbar';
import { TopToolbar } from './components/TopToolbar';
import { ErasePanel } from './erase/ErasePanel';
import { GeneratePanel } from './generate/GeneratePanel';
import { InpaintPanel } from './generate/InpaintPanel';
import { ActiveMural } from './mural/ActiveMural';
import { MuralTransformWrapper } from './mural/MuralTransformWrapper';
import { useStores } from './store';
import { UIMode } from './store/models';

export const App = observer(() => {
  const {
    uiStore: { activeMode },
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
      backgroundColor={'blackAlpha.50'}
    >
      <TopToolbar
        margin='2rem'
        width='calc(100% - 4rem)'
        maxWidth='80rem'
        zIndex={'docked'}
      />

      <Spacer />

      {activeMode === UIMode.Generate && (
        <GeneratePanel
          margin={'2rem'}
          zIndex={'docked'}
        />
      )}

      {activeMode === UIMode.Inpaint && (
        <InpaintPanel
          // maxWidth={'70rem'}
          margin={'2rem'}
          zIndex={'docked'}
        />
      )}

      {activeMode === UIMode.Erase && (
        <ErasePanel
          marginX={'2rem'}
          marginBottom={'8rem'}
          zIndex={'docked'}
        />
      )}

      {activeMode === UIMode.None && (
        <CommandToolbar
          margin={'2rem'}
          zIndex={'docked'}
        />
      )}

      <MuralTransformWrapper position={'absolute'}>
        <ActiveMural />
      </MuralTransformWrapper>
    </Flex>
  );
});
