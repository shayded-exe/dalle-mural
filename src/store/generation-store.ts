import { makeAutoObservable, runInAction } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

import { DalleGenerationMeta } from '../dalle';
import { Generation } from '../domain-objects';
import { RootStore } from './root-store';

export class GenerationStore {
  generations: Generation[] = [];

  get resultGenerations(): Generation[] {
    const task = this.#taskStore.resultTask;

    if (!task) {
      return [];
    }

    return task.generations.data.map(g => this.getGenerationById(g.id));
  }

  get #taskStore() {
    return this.rootStore.taskStore;
  }

  constructor(readonly rootStore: RootStore) {
    makeAutoObservable(this, {
      rootStore: false,
    });
    makePersistable(this, {
      name: 'GenerationStore',
      properties: [
        //
        'generations',
      ],
    });
  }

  getGenerationById(id: string): Generation {
    const generation = this.generations.find(g => g.id === id);

    if (!generation) {
      throw new Error(`Generation not found: ${id}`);
    }

    return generation;
  }

  async addGenerations(dtos: DalleGenerationMeta[]) {
    const promises = dtos.map(dto =>
      Generation.fromApi(dto, this.rootStore.dalle),
    );
    const generations = await Promise.all(promises);

    runInAction(() => {
      this.generations.push(...generations);
    });
  }
}
