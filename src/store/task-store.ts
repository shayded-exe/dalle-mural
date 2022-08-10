import { makeAutoObservable, runInAction } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

import { DalleTask, SuccessfulDalleTask } from '../dalle';
import { RootStore } from './root-store';

export class TaskStore {
  successfulTasks: { [id: string]: SuccessfulDalleTask } = {};
  resultTaskId: string | null = null;

  get resultTask(): SuccessfulDalleTask | null {
    return !this.resultTaskId ? null : this.getTaskById(this.resultTaskId);
  }

  get #generationStore() {
    return this.#rootStore.generationStore;
  }

  #rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.#rootStore = rootStore;

    makeAutoObservable(this);
    makePersistable(this, {
      name: 'TaskStore',
      properties: [
        //
        'successfulTasks',
        'resultTaskId',
      ],
    });
  }

  getTaskById(id: string): SuccessfulDalleTask {
    const task = this.successfulTasks[id];

    if (!task) {
      throw new Error(`Task not found: ${id}`);
    }

    return task;
  }

  async addTask(task: DalleTask) {
    if (task.status !== 'succeeded') {
      throw new Error(`Task not succeeded. ${task}`);
      // console.warn('Task failed', { task });
    }

    this.successfulTasks[task.id] = task;
    await this.#generationStore.add(task.generations.data);
  }

  async loadResult(task: DalleTask) {
    await this.addTask(task);

    runInAction(() => {
      this.resultTaskId = task.id;
    });
  }
}