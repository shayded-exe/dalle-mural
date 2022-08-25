import { chakra, Flex, Spacer } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { TopToolbar } from '../components/TopToolbar';
import { ZStack } from '../components/ZStack';
import { ErasePanel } from '../erase/ErasePanel';
import { GeneratePanel } from '../generate/GeneratePanel';
import { InpaintPanel } from '../generate/InpaintPanel';
import { useStores } from '../store';
import { UIMode } from '../store/models';
import { ActiveMural } from './ActiveMural';
import { MuralTools } from './MuralTools';

export interface MuralPageProps {}

export const MuralPage = chakra(observer(_MuralPage));

function _MuralPage({ ...passthrough }: MuralPageProps) {
  const {
    muralStore: { hasActiveMural },
    uiStore: { activeMode },
  } = useStores();

  return (
    <ZStack
      backgroundColor='background'
      {...passthrough}
    >
      <Flex
        width='100%'
        maxWidth='100rem'
        marginX='auto'
        padding='2rem'
        paddingBottom='4rem'
        direction='column'
        align='stretch'
      >
        <TopToolbar
          marginX='10rem'
          zIndex='docked'
        />

        <MuralTools
          alignSelf='end'
          marginTop='8rem'
          zIndex='docked'
        />

        <Spacer />

        {activeMode === UIMode.Generate && (
          <GeneratePanel
            marginX='10rem'
            zIndex='docked'
          />
        )}

        {activeMode === UIMode.Inpaint && (
          <InpaintPanel
            marginX='10rem'
            zIndex='docked'
          />
        )}

        {activeMode === UIMode.Erase && (
          <ErasePanel
            alignSelf='center'
            marginBottom='2rem'
            zIndex='docked'
          />
        )}
      </Flex>

      {hasActiveMural && <ActiveMural />}
    </ZStack>
  );
}
