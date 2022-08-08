import { action, computed, makeObservable, observable } from 'mobx';

import type { RootStore } from '../store';
import { StorableDomainObject } from '../store';
import { Generation } from './generation';

export interface MuralSize {
  width: number;
  height: number;
}

export class Mural extends StorableDomainObject {
  width = 1;
  height = 1;
  generationIds: (string | null)[][] = [[null]];

  get generations(): (Generation | null)[][] {
    return this.generationIds.map(row =>
      row.map(id =>
        id == null ? null : this.#generationStore.getGenerationById(id),
      ),
    );
  }

  get #generationStore() {
    return this.rootStore.generationStore;
  }

  static create(rootStore: RootStore): Mural {
    return super.baseCreate(Mural, rootStore);
  }

  makeObservable() {
    makeObservable(this, {
      width: observable,
      height: observable,
      generationIds: observable,
      generations: computed,
      place: action,
      resize: action,
    });
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
    if (x < 0 || this.width <= x || y < 0 || this.height <= y) {
      throw new Error(`Generation coordinates out of bounds. ${arguments[0]}`);
    }

    this.generationIds[x][y] = generationId;
  }

  resize({ width, height }: MuralSize) {
    this.width = width;
    this.height = height;
  }
}
