import { PersistStoreMap } from 'mobx-persist-store';

import { Dalle } from '../dalle';
import { DalleStore } from './dalle-store';
import { GenerationStore } from './generation-store';
import { MuralStore } from './mural-store';
import { TaskStore } from './task-store';

export class RootStore {
  readonly dalleStore = new DalleStore();
  readonly taskStore = new TaskStore(this);
  readonly generationStore = new GenerationStore(this);
  readonly muralStore = new MuralStore(this);

  get dalle(): Dalle {
    return this.dalleStore.dalle;
  }

  async clear() {
    for (const store of PersistStoreMap.values())
      await store.clearPersistedStore();

    window.location.reload();
  }
}
