import { makeAutoObservable } from 'mobx';

import { ImageDataUrl } from '../utils';
import { Generation, Mural, MuralCoords, UIMode } from './models';
import { RootStore } from './root-store';

export class UIStore {
  get #generationStore() {
    return this.#rootStore.generationStore;
  }

  get #muralStore() {
    return this.#rootStore.muralStore;
  }

  #rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.#rootStore = rootStore;

    makeAutoObservable(this, {}, { autoBind: true });
  }

  activeMode = UIMode.None;

  get isGeneratePanelOpen() {
    return this.activeMode === UIMode.Generate;
  }

  get isInpaintPanelOpen() {
    return this.activeMode === UIMode.Inpaint;
  }

  closePanel() {
    this.activeMode = UIMode.None;
    this.#muralStore.deselectTile();
  }

  openGeneratePanel() {
    this.activeMode = UIMode.Generate;
    this.#muralStore.deselectTile();
  }

  openInpaintingPanel() {
    this.activeMode = UIMode.Inpaint;
    this.#muralStore.deselectTile();
  }

  selectedResultId: string | null = null;

  get previewGeneration(): Generation | null {
    const id = this.selectedResultId;

    return !id ? null : this.#generationStore.getById(id);
  }

  selectResult(id: string) {
    this.selectedResultId = id;
  }

  deselectResult() {
    this.selectedResultId = null;
  }

  inpaintPromptImage: ImageDataUrl | null = null;

  async loadInpaintPromptImage(coords: MuralCoords) {
    this.inpaintPromptImage = await Mural.rasterizeTile({
      mural: this.#muralStore.activeMural,
      ...coords,
    });
  }
}
