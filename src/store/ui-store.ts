import { makeAutoObservable } from 'mobx';

import { Generation, UIMode } from './models';
import { RootStore } from './root-store';

export class UIStore {
  get #generationStore() {
    return this.#rootStore.generationStore;
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
  }

  openGeneratePanel() {
    this.activeMode = UIMode.Generate;
  }

  openInpaintingPanel() {
    this.activeMode = UIMode.Inpaint;
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
}
