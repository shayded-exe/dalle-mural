import { autorun, makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

import { Dalle } from '../dalle';

export class DalleStore {
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

  readonly dalle = new Dalle();

  authToken = '';
  setAuthToken(authToken: string) {
    this.authToken = authToken;
  }
  get isSignedIn() {
    this.authToken; // observe
    return !!this.dalle.isSignedIn;
  }
}
