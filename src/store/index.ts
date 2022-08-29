import localForage from 'localforage';
import { configurePersistable } from 'mobx-persist-store';
import { createContext, useContext } from 'react';

import { RootStore } from './root-store';

configurePersistable(
  {
    storage: localForage,
    stringify: false,
  },
  {
    delay: 300,
  },
);

export const StoresContext = createContext<RootStore>(undefined as any);

export const useStores = () => useContext(StoresContext);

export * from './root-store';
export * as models from './models';
