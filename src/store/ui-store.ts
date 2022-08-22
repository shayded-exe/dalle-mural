import { makeAutoObservable } from 'mobx';

import { BrushShape, BrushSize, CircleSize, Dimensions, Rect } from '../canvas';
import { MuralRef } from '../mural/Mural';
import { ImageDataUrl } from '../utils';
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
    if (this.activeMode === UIMode.Erase) {
      this.cancelErase();
    }

    this.activeMode = UIMode.None;
    this.deselectArea();
    this.deselectGeneration();
  }

  muralRef: MuralRef | null = null;
  setMuralRef(ref: MuralRef | null) {
    this.muralRef = ref;
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
    ].includes(this.activeMode);
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
      return this.muralRef!.getRectImage(this.selectionArea!);
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

  get canErase() {
    return this.activeMode === UIMode.Erase;
  }
  eraseBrushShape = BrushShape.Circle;
  setEraseBrushShape(value: BrushShape) {
    this.eraseBrushShape = value;
  }
  eraseBrushScale = 1 / 4;
  setEraseBrushScale(value: number) {
    this.eraseBrushScale = value;
  }
  get eraseBrushSize(): BrushSize {
    const size = Generation.SIZE * this.eraseBrushScale;

    switch (this.eraseBrushShape) {
      case BrushShape.Rect:
        return Dimensions.fromSize(size);
      case BrushShape.Circle:
        return { radius: size / 2 } as CircleSize;
    }
  }
  canPlaceErase = false;
  onEraseStart() {
    this.canPlaceErase = true;
  }
  placeErase() {
    const eraseMask = this.muralRef!.getEraseMask();
    this.#muralStore.placeErase(eraseMask);
    this.cancelErase();
  }
  cancelErase() {
    this.canPlaceErase = false;
    this.muralRef!.clearEraseFill();
  }

  rasterize(): ImageDataUrl {
    return this.muralRef!.rasterize();
  }
}
