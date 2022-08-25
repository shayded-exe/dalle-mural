import './App.css';

import { Center, Spinner } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { AuthPage } from './auth/AuthPage';
import { MuralPage } from './mural/MuralPage';
import { useStores } from './store';

export const App = observer(() => {
  const {
    dalleStore: { isSignedIn },
    isHydrated,
  } = useStores();

  if (!isHydrated) {
    return (
      <Center height='100vh'>
        <Spinner />
      </Center>
    );
  }

  if (!isSignedIn) {
    return (
      <Center>
        <AuthPage marginTop='10rem' />
      </Center>
    );
  }

  return <MuralPage height='100vh' />;
});
