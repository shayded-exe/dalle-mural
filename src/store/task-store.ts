import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

import { DalleTask, SuccessfulDalleTask } from '../dalle';
import { RootStore } from './root-store';

export class TaskStore {
  successfulTasks: { [id: string]: SuccessfulDalleTask } = {};

  get #generationStore() {
    return this.#rootStore.generateStore;
  }

  #rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.#rootStore = rootStore;

    makeAutoObservable(this, {}, { autoBind: true });
    makePersistable(this, {
      name: 'TaskStore',
      properties: [
        //
        'successfulTasks',
      ],
    });
  }

  getById(id: string): SuccessfulDalleTask {
    const task = this.successfulTasks[id];

    if (!task) {
      throw new Error(`Task not found: ${id}`);
    }

    return task;
  }

  add(task: DalleTask) {
    if (task.status !== 'succeeded') {
      throw new Error(`Task not succeeded. ${task}`);
      // console.warn('Task failed', { task });
    }

    this.successfulTasks[task.id] = task;
  }
}
