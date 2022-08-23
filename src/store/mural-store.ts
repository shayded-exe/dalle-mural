import { pull } from 'lodash';
import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import * as uuid from 'uuid';

import { Coordinates } from '../canvas';
import { ImageDataUrl } from '../utils';
import { Generation, Mural, MuralOptions } from './models';

export class MuralStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    makePersistable(this, {
      name: 'MuralStore',
      properties: [
        //
        'murals',
        'activeMuralId',
      ],
    });

    // if (!this.hasActiveMural) {
    //   this.createAndActivate();
    // }
  }

  murals: Mural[] = [];

  activeMuralId: string | null = null;
  get hasActiveMural(): boolean {
    return !!this.activeMuralId;
  }
  get activeMural(): Mural | undefined {
    return this.getById(this.activeMuralId!);
  }

  getById(id: string): Mural | undefined {
    return this.murals.find(m => m.id === id);
  }
  getByIdOrFail(id: string): Mural {
    const mural = this.getById(id);

    if (!mural) {
      throw new Error(`Mural not found: ${id}`);
    }

    return mural;
  }

  createAndOpen(options: MuralOptions): Mural {
    const mural = Mural.create(options);
    this.murals.unshift(mural);
    return this.open(mural.id);
  }

  open(id: string): Mural {
    const mural = this.getByIdOrFail(id);
    this.activeMuralId = mural.id;
    return mural;
  }

  delete(id: string) {
    const mural = this.getByIdOrFail(id);
    if (this.activeMuralId === id) {
      this.activeMuralId = null;
    }
    pull(this.murals, mural);
  }

  setIsFavorite(id: string, isFavorite: boolean) {
    const mural = this.getByIdOrFail(id);
    mural.isFavorite = isFavorite;
  }

  placeGeneration({
    generation,
    x,
    y,
  }: {
    generation: Generation;
  } & Coordinates): Mural.GenerationItem {
    const mural = this.activeMural!;

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

  placeErase(mask: ImageDataUrl): Mural.EraseItem {
    const mural = this.activeMural!;

    const item: Mural.EraseItem = {
      id: uuid.v4(),
      type: 'erase',
      mask,
      x: 0,
      y: 0,
      width: mural.width,
      height: mural.height,
    };
    mural.items.push(item);
    return item;
  }

  undo(): Mural.Item | undefined {
    return this.activeMural!.items.pop();
  }

  clearMural() {
    this.activeMural!.items = [];
  }

  setPreviewImage(image: ImageDataUrl | null) {
    this.activeMural!.previewImage = image;
  }
}
