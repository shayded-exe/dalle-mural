import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';
import { THEME } from './theme';

const rootElement = document.getElementById('root')!;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ChakraProvider theme={THEME}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
);
