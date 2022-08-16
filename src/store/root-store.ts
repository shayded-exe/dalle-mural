import { PersistStoreMap } from 'mobx-persist-store';

import { Dalle } from '../dalle';
import { DalleStore } from './dalle-store';
import { GenerateStore } from './generate-store';
import { MuralStore } from './mural-store';
import { TaskStore } from './task-store';
import { UIStore } from './ui-store';

export class RootStore {
  readonly uiStore = new UIStore(this);
  readonly dalleStore = new DalleStore();
  readonly taskStore = new TaskStore(this);
  readonly generateStore = new GenerateStore(this);
  readonly muralStore = new MuralStore(this);

  get isHydrated(): boolean {
    const stores = Array.from(PersistStoreMap.values());

    return stores.every(s => s.isHydrated);
  }

  get dalle(): Dalle {
    return this.dalleStore.dalle;
  }

  async clear() {
    for (const store of PersistStoreMap.values())
      await store.clearPersistedStore();

    window.location.reload();
  }
}
