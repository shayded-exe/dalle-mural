import { makeAutoObservable } from 'mobx';

import { Rect } from '../utils';
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
    this.clearPreviewGeneration();
  }

  openGeneratePanel() {
    this.activeMode = UIMode.Generate;
  }

  openInpaintingPanel() {
    this.activeMode = UIMode.Inpaint;
  }

  previewGeneration: Generation | null = null;

  setPreviewGeneration(generation: Generation) {
    this.previewGeneration = generation;
  }

  clearPreviewGeneration() {
    this.previewGeneration = null;
  }

  get canSelect() {
    return this.isGeneratePanelOpen || this.isInpaintPanelOpen;
  }

  selectionArea: Rect | null = null;

  selectArea(rect: Rect) {
    this.selectionArea = rect;
  }

  deselectArea() {
    this.selectionArea = null;
  }

  get canPlaceGeneration() {
    return !!this.previewGeneration && !!this.selectionArea;
  }

  placeGeneration() {
    if (!this.canPlaceGeneration) {
      throw new Error(`Tried to place generation when not allowed`);
    }

    this.#muralStore.placeGeneration({
      generation: this.previewGeneration!,
      ...this.selectionArea!,
    });
    this.clearPreviewGeneration();
  }
}
