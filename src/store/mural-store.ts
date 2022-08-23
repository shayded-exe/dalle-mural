import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import * as uuid from 'uuid';

import { Coordinates } from '../canvas';
import { ImageDataUrl } from '../utils';
import { Generation, Mural } from './models';

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
  get activeMural(): Mural {
    return this.getById(this.activeMuralId!);
  }

  createAndActivate(): Mural {
    const mural = Mural.create();

    this.murals.unshift(mural);
    this.activeMuralId = mural.id;

    return mural;
  }

  getById(id: string): Mural {
    const mural = this.murals.find(m => m.id === id);

    if (!mural) {
      throw new Error(`Generation not found: ${id}`);
    }

    return mural;
  }

  setPreviewImage(image: ImageDataUrl | null) {
    this.activeMural.previewImage = image;
  }

  placeGeneration({
    generation,
    x,
    y,
  }: {
    generation: Generation;
  } & Coordinates): Mural.GenerationItem {
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

  placeErase(mask: ImageDataUrl): Mural.EraseItem {
    const mural = this.activeMural;

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
    return this.activeMural.items.pop();
  }

  clearMural() {
    this.activeMural.items = [];
  }
}
