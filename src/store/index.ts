import { configurePersistable } from 'mobx-persist-store';
import { createContext, useContext } from 'react';

import { RootStore } from './root-store';

configurePersistable(
  {
    storage: localStorage,
  },
  {
    delay: 1000,
  },
);

export const StoresContext = createContext(new RootStore());

export const useStores = () => useContext(StoresContext);

export * from './root-store';
export * from './storage';
