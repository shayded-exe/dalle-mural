import { makeAutoObservable } from 'mobx';

import { Generation, UIMode } from './models';
import { RootStore } from './root-store';

export class UIStore {
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
}
