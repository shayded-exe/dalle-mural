import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

import { Generation, Mural, MuralCoords, ResizeAnchor } from './models';
import { RootStore } from './root-store';

export class MuralStore {
  murals: { [id: string]: Mural } = {};
  activeMuralId: string | null = null;

  selectedTile: MuralCoords | null = null;

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

    makeAutoObservable(this, {}, { autoBind: true });
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

  selectTile(coords: MuralCoords) {
    this.selectedTile = coords;
  }

  async inpaint({ x, y }: MuralCoords) {
    const mural = this.activeMural;
    const raster = await Mural.rasterize(mural);
  }

  place({
    generationId,
    x,
    y,
  }: {
    generationId: string;
  } & MuralCoords) {
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
    throw new Error('Not implemented');
    const mural = this.activeMural;

    mural.width = width;
    mural.height = height;
  }
}
