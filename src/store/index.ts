import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { createContext, useContext } from 'react';

export class DalleStore {
  authToken = '';

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'DalleStore',
      properties: [
        //
        'authToken',
      ],
    });
  }
}

export const dalleStoreContext = createContext(new DalleStore());

export const useStore = () => useContext(dalleStoreContext);
