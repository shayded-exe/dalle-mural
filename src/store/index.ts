import localForage from 'localforage';
import { configurePersistable } from 'mobx-persist-store';
import { createContext, useContext } from 'react';

import { RootStore } from './root-store';

configurePersistable(
  {
    storage: localForage,
  },
  {
    delay: 1000,
  },
);

export const StoresContext = createContext<RootStore>(undefined as any);

export const useStores = () => useContext(StoresContext);

export * from './root-store';
export * as models from './models';
