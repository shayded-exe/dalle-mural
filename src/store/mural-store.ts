import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

import { Generation, Mural, ResizeAnchor } from './models';
import { RootStore } from './root-store';

export class MuralStore {
  murals: { [id: string]: Mural } = {};
  activeMuralId?: string;

  get hasActiveMural(): boolean {
    return !!this.activeMuralId;
  }

  get activeMural(): Mural {
    return this.getById(this.activeMuralId!);
  }

  get generations(): (Generation | null)[][] {
    return this.activeMural.generations;
  }

  get #generationStore() {
    return this.#rootStore.generationStore;
  }

  #rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.#rootStore = rootStore;

    makeAutoObservable(this);
    makePersistable(this, {
      name: 'MuralStore',
      properties: [
        //
        'murals',
        'activeMuralId',
      ],
    });

    if (!this.hasActiveMural) {
      this.createAndActivate();
    }
  }

  createAndActivate(): Mural {
    const mural = Mural.create();

    this.murals[mural.id] = mural;
    this.activeMuralId = mural.id;

    return mural;
  }

  getById(id: string): Mural {
    const mural = this.murals[id];

    if (!mural) {
      throw new Error(`Generation not found: ${id}`);
    }

    return mural;
  }

  place({
    generationId,
    x,
    y,
  }: {
    generationId: string;
    x: number;
    y: number;
  }) {
    const mural = this.activeMural;

    if (x < 0 || mural.width <= x || y < 0 || mural.height <= y) {
      throw new Error(`Generation coordinates out of bounds. ${arguments[0]}`);
    }

    mural.generations[x][y] = this.#generationStore.getById(generationId);
  }

  resize({
    width,
    height,
    anchor,
  }: {
    width: number;
    height: number;
    anchor: ResizeAnchor;
  }) {
    const mural = this.activeMural;

    mural.width = width;
    mural.height = height;
  }
}
