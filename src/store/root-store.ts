import { PersistStoreMap } from 'mobx-persist-store';

import { DalleStore } from './dalle-store';
import { MuralStore } from './mural-store';
import { UIStore } from './ui-store';

export class RootStore {
  readonly uiStore = new UIStore(this);
  readonly dalleStore = new DalleStore();
  readonly muralStore = new MuralStore();

  get isHydrated(): boolean {
    const stores = Array.from(PersistStoreMap.values());

    return stores.every(s => s.isHydrated);
  }

  async clear() {
    for (const store of PersistStoreMap.values()) {
      await store.clearPersistedStore();
    }

    window.location.reload();
  }
}
