import { makeAutoObservable, runInAction } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

import { DalleGenerationMeta } from '../dalle';
import { Generation } from './models';
import { RootStore } from './root-store';

export class GenerationStore {
  generations: Generation[] = [];
  selectedResultId: string | null = null;

  get resultGenerations(): Generation[] {
    const task = this.#taskStore.resultTask;

    if (!task) {
      return [];
    }

    return task.generations.data.map(g => this.getById(g.id));
  }

  get selectedResult(): Generation | null {
    return !this.selectedResultId ? null : this.getById(this.selectedResultId);
  }

  get #dalle() {
    return this.#rootStore.dalle;
  }

  get #taskStore() {
    return this.#rootStore.taskStore;
  }

  #rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.#rootStore = rootStore;

    makeAutoObservable(this);
    makePersistable(this, {
      name: 'GenerationStore',
      properties: [
        //
        'generations',
      ],
    });
  }

  getById(id: string): Generation {
    const generation = this.generations.find(g => g.id === id);

    if (!generation) {
      throw new Error(`Generation not found: ${id}`);
    }

    return generation;
  }

  async add(dtos: DalleGenerationMeta[]) {
    const promises = dtos.map(dto => Generation.fromApi(dto, this.#dalle));
    const generations = await Promise.all(promises);

    runInAction(() => {
      this.generations.push(...generations);
    });
  }

  selectResult(id: string) {
    this.selectedResultId = id;
  }
}
