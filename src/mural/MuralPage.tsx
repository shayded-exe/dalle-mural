import { chakra, Flex, Spacer } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { TopToolbar } from '../components/TopToolbar';
import { ZStack } from '../components/ZStack';
import { ErasePanel } from '../erase/ErasePanel';
import { ConfirmPlaceButton } from '../generate/ConfirmPlaceButton';
import { GeneratePanel } from '../generate/GeneratePanel';
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
        maxWidth='120rem'
        marginX='auto'
        paddingTop='2rem'
        padding='4rem'
        direction='column'
        align='stretch'
      >
        <TopToolbar
          marginX='20rem'
          zIndex='docked'
        />

        {activeMode === UIMode.Generate ? (
          <GeneratePanel
            alignSelf='start'
            marginTop='4rem'
            zIndex='docked'
            minWidth='40rem'
            maxWidth='40rem'
            minHeight='0'
          />
        ) : (
          <MuralTools
            alignSelf='start'
            marginTop='8rem'
            marginLeft='10rem'
            zIndex='docked'
          />
        )}

        <Spacer />

        {activeMode === UIMode.Erase && (
          <ErasePanel
            alignSelf='center'
            marginBottom='2rem'
            zIndex='docked'
          />
        )}
      </Flex>

      <Flex
        align='end'
        justify='center'
        padding='4rem'
      >
        <ConfirmPlaceButton
          marginBottom='2rem'
          zIndex='docked'
        />
      </Flex>

      {hasActiveMural && <ActiveMural />}
    </ZStack>
  );
}
