import { chain, keyBy } from 'lodash';
import { makeAutoObservable, runInAction } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

import { DalleGenerationMeta, SuccessfulDalleTask } from '../dalle';
import { Generation } from './models';
import { RootStore } from './root-store';

export class GenerateStore {
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

  generations: { [id: string]: Generation } = {};

  get generationHistory(): Generation[][] {
    return chain(Object.values(this.generations))
      .orderBy(g => g.created_at, 'desc')
      .chunk(4)
      .value();
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

  async loadTask(task: SuccessfulDalleTask) {
    this.#taskStore.add(task);
    await this.add(task.generations.data);
  }
}
