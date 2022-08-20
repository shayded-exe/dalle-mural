import { chain, keyBy } from 'lodash';
import { makeAutoObservable, runInAction } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

import { DalleGenerationMeta, SuccessfulDalleTask } from '../dalle';
import { Generation } from './models';
import { RootStore } from './root-store';

export class InpaintStore {
  get #dalle() {
    return this.#rootStore.dalle;
  }

  get #uiStore() {
    return this.#rootStore.uiStore;
  }

  #rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.#rootStore = rootStore;
    makeAutoObservable(this, {}, { autoBind: true });
    makePersistable(this, {
      name: 'InpaintStore',
      properties: [
        //
        'inpaintings',
      ],
    });

    // reaction(
    //   () => this.#uiStore.selectionAreaImage,
    //   () => this.clear(),
    // );
  }

  inpaintings: { [id: string]: Generation } = {};

  get inpaintHistory(): Generation[][] {
    return chain(Object.values(this.inpaintings))
      .orderBy(g => g.created_at, 'desc')
      .chunk(3)
      .value();
  }

  // TODO: dedupe with GenerationStore
  async add(dtos: DalleGenerationMeta[]) {
    const generations = await Promise.all(
      dtos.map(dto => Generation.fromApi(dto, this.#dalle)),
    );

    runInAction(() => {
      Object.assign(
        this.inpaintings,
        keyBy(generations, g => g.id),
      );
    });
  }

  async addFromTask(task: SuccessfulDalleTask) {
    await this.add(task.generations.data);
  }

  clear() {
    this.inpaintings = {};
  }
}
