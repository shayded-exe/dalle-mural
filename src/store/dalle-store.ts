import { autorun, makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

import { Dalle } from '../dalle';
import { RootStore } from './root-store';

export class DalleStore {
  authToken = '';

  readonly dalle = new Dalle();

  #rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.#rootStore = rootStore;

    makeAutoObservable(this);
    makePersistable(this, {
      name: 'AuthStore',
      properties: [
        //
        'authToken',
      ],
    });

    autorun(() => {
      this.dalle.authToken = this.authToken;
    });
  }

  setAuthToken(authToken: string) {
    this.authToken = authToken;
  }
}
