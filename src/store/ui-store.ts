import { makeAutoObservable } from 'mobx';

import { cropCanvasToImage } from '../canvas';
import { Dimensions, ImageDataUrl, Rect } from '../utils';
import { Generation, UIMode } from './models';
import { RootStore } from './root-store';

export class UIStore {
  get #muralStore() {
    return this.#rootStore.muralStore;
  }

  #rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.#rootStore = rootStore;

    makeAutoObservable(this, {}, { autoBind: true });
  }

  activeMode = UIMode.None;
  activateMode(mode: Exclude<UIMode, UIMode.None>) {
    this.activeMode = mode;
  }
  closePanel() {
    this.activeMode = UIMode.None;
    this.deselectArea();
    this.deselectGeneration();
  }

  canvas: HTMLCanvasElement | null = null;
  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  selectedGeneration: Generation | null = null;
  selectGeneration(generation: Generation | null) {
    this.selectedGeneration = generation;
  }
  deselectGeneration() {
    this.selectedGeneration = null;
  }

  get canSelectArea() {
    return [
      //
      UIMode.Generate,
      UIMode.Inpaint,
      UIMode.Erase,
    ].includes(this.activeMode);
  }
  _selectionAreaScale = 1;
  get selectionAreaScale(): number {
    return this.activeMode === UIMode.Erase ? this._selectionAreaScale : 1;
  }
  setSelectionAreaScale(value: number) {
    this._selectionAreaScale = value;
  }
  get selectionAreaDimensions(): Dimensions {
    if (this.activeMode === UIMode.Erase) {
      const size = Generation.SIZE * this.selectionAreaScale;
      return Dimensions.fromSize(size);
    }

    return Generation.DIMENSIONS;
  }
  selectionArea: Rect | null = null;
  setSelectionArea(value: Rect | null) {
    this.selectionArea = value;
  }
  isAreaSelected = false;
  selectArea() {
    this.isAreaSelected = true;
  }
  deselectArea() {
    this.isAreaSelected = false;
  }
  get selectionAreaImage(): ImageDataUrl | null {
    if (this.isAreaSelected && this.activeMode === UIMode.Inpaint) {
      return cropCanvasToImage({
        canvas: this.canvas!,
        rect: this.selectionArea!,
      });
    }

    return null;
  }

  get canPlaceGeneration() {
    return !!this.selectedGeneration && !!this.isAreaSelected;
  }
  placeGeneration() {
    if (!this.canPlaceGeneration) {
      throw new Error(`Tried to place generation when not allowed`);
    }

    this.#muralStore.placeGeneration({
      generation: this.selectedGeneration!,
      ...this.selectionArea!,
    });
    this.deselectGeneration();
  }

  rasterize(): ImageDataUrl {
    return this.canvas!.toDataURL() as ImageDataUrl;
  }
}
