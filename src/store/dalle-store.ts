import { autorun, makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

import { Dalle } from '../dalle';

export class DalleStore {
  authToken = '';

  readonly dalle = new Dalle();

  get isSignedIn() {
    this.authToken; // observe
    return !!this.dalle.isSignedIn;
  }

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
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
