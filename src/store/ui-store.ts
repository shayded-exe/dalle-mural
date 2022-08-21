import { makeAutoObservable } from 'mobx';

import { cropCanvasToImage } from '../canvas';
import { ImageDataUrl, Rect } from '../utils';
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
  get isPanelOpen() {
    return this.activeMode !== UIMode.None;
  }
  get isGeneratePanelOpen() {
    return this.activeMode === UIMode.Generate;
  }
  get isInpaintPanelOpen() {
    return this.activeMode === UIMode.Inpaint;
  }
  closePanel() {
    this.activeMode = UIMode.None;
    this.deselectArea();
    this.deselectGeneration();
  }
  openGeneratePanel() {
    this.activeMode = UIMode.Generate;
  }
  openInpaintingPanel() {
    this.activeMode = UIMode.Inpaint;
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
    return this.isGeneratePanelOpen || this.isInpaintPanelOpen;
  }

  selectionArea: Rect | null = null;
  selectionAreaImage: ImageDataUrl | null = null;
  setSelectionArea(value: Rect | null) {
    this.selectionArea = value;
  }

  isAreaSelected = false;
  selectArea() {
    this.isAreaSelected = true;

    if (this.isInpaintPanelOpen) {
      this.selectionAreaImage = cropCanvasToImage({
        canvas: this.canvas!,
        rect: this.selectionArea!,
      });
    }
  }
  deselectArea() {
    this.isAreaSelected = false;
    this.selectionAreaImage = null;
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
