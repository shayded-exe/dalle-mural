import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import * as uuid from 'uuid';

import { Coordinates, ImageDataUrl } from '../utils';
import { Generation, Mural } from './models';
import { RootStore } from './root-store';

export class MuralStore {
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

  murals: { [id: string]: Mural } = {};
  activeMuralId: string | null = null;

  get hasActiveMural(): boolean {
    return !!this.activeMuralId;
  }

  get activeMural(): Mural {
    return this.getById(this.activeMuralId!);
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

  placeGeneration({
    generation,
    x,
    y,
  }: {
    generation: Generation;
  } & Coordinates): Mural.Item {
    const mural = this.activeMural;

    if (
      x + Generation.SIZE < 0 ||
      mural.width <= x ||
      y + Generation.SIZE < 0 ||
      mural.height <= y
    ) {
      throw new Error(`Generation coordinates out of bounds. ${arguments[0]}`);
    }

    const item: Mural.GenerationItem = {
      id: uuid.v4(),
      type: 'generation',
      generation,
      x,
      y,
      ...Generation.DIMENSIONS,
    };
    mural.items.push(item);
    return item;
  }

  undo(): Mural.Item | undefined {
    return this.activeMural.items.pop();
  }

  clearMural() {
    this.activeMural.items = [];
  }

  #rasterizeFunc: RasterizeFunc | null = null;

  setRasterizeFunc(func: RasterizeFunc) {
    this.#rasterizeFunc = func;
  }

  rasterize(): ImageDataUrl {
    if (!this.#rasterizeFunc) {
      throw new Error('Rasterize func not set');
    }

    return this.#rasterizeFunc();
  }
}

type RasterizeFunc = () => ImageDataUrl;
