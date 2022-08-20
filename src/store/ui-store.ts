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
    this.deselectPreviewGeneration();
  }

  openGeneratePanel() {
    this.activeMode = UIMode.Generate;
  }

  openInpaintingPanel() {
    this.activeMode = UIMode.Inpaint;
  }

  previewGeneration: Generation | null = null;
  selectPreviewGeneration(generation: Generation | null) {
    this.previewGeneration = generation;
  }
  deselectPreviewGeneration() {
    this.previewGeneration = null;
  }

  get canSelect() {
    return this.isGeneratePanelOpen || this.isInpaintPanelOpen;
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
    this.deselectPreviewGeneration();
  }
}
