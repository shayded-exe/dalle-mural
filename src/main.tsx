import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';
import { RootStore, StoresContext } from './store';
import { THEME } from './theme';

declare global {
  // debug only
  var __store: RootStore;
}

const rootStore = (globalThis.__store = new RootStore());

const rootElement = document.getElementById('root')!;
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ChakraProvider theme={THEME}>
      <StoresContext.Provider value={rootStore}>
        <App />
      </StoresContext.Provider>
    </ChakraProvider>
  </React.StrictMode>,
);
