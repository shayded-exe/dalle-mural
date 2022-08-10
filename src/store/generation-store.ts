import { keyBy } from 'lodash-es';
import { makeAutoObservable, runInAction } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

import { DalleGenerationMeta } from '../dalle';
import { Generation } from './models';
import { RootStore } from './root-store';

export class GenerationStore {
  generations: { [id: string]: Generation } = {};
  selectedResultId: string | null = null;

  get resultGenerations(): Generation[] {
    const task = this.#taskStore.resultTask;

    if (!task) {
      return [];
    }

    return task.generations.data.map(g => this.getById(g.id));
  }

  get selectedResult(): Generation | null {
    const id = this.selectedResultId;

    return !id ? null : this.getById(id);
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

    makeAutoObservable(this, {}, { autoBind: true });
    makePersistable(this, {
      name: 'GenerationStore',
      properties: [
        //
        'generations',
      ],
    });
  }

  getById(id: string): Generation {
    const generation = this.generations[id];

    if (!generation) {
      throw new Error(`Generation not found: ${id}`);
    }

    return generation;
  }

  async add(dtos: DalleGenerationMeta[]) {
    const promises = dtos.map(dto => Generation.fromApi(dto, this.#dalle));
    const generations = await Promise.all(promises);

    runInAction(() => {
      Object.assign(
        this.generations,
        keyBy(generations, g => g.id),
      );
    });
  }

  selectResult(id: string) {
    this.selectedResultId = id;
  }

  deselectResult() {
    this.selectedResultId = null;
  }
}
