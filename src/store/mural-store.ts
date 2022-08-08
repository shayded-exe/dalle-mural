import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

import { Mural } from '../domain-objects';
import { RootStore } from './root-store';
import { DomainObjectStorageController, StorableDomainObject } from './storage';

export class MuralStore {
  activeMural: Mural;

  #rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.#rootStore = rootStore;

    makeAutoObservable(this);
    makePersistable(this, {
      name: 'MuralStore',
      properties: [
        //
        // 'activeMural',
      ],
      storage: new DomainObjectStorageController({
        storage: localStorage,
        transform: this.deserializeProp,
      }),
    });

    this.activeMural = Mural.create(rootStore);
  }

  deserializeProp(key: string, value: any): any {
    switch (key as keyof MuralStore) {
      case 'activeMural':
        return StorableDomainObject.fromJson(Mural, this.#rootStore, value);
      default:
        return value;
    }
  }
}
