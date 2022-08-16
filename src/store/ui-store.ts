import { makeAutoObservable } from 'mobx';

import { ImageDataUrl } from '../utils';
import { Mural, MuralCoords, UIMode } from './models';
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

  inpaintPromptImage: ImageDataUrl | null = null;

  async loadInpaintPromptImage(coords: MuralCoords) {
    this.inpaintPromptImage = await Mural.rasterizeTile({
      mural: this.#muralStore.activeMural,
      ...coords,
    });
  }
}
