import { ChakraProvider } from '@chakra-ui/react';
import { configurePersistable } from 'mobx-persist-store';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';
import { THEME } from './theme';

configurePersistable(
  {
    storage: window.localStorage,
  },
  {
    delay: 1000,
  },
);

const rootElement = document.getElementById('root')!;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ChakraProvider theme={THEME}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
);
