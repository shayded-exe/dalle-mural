import { autorun, makeAutoObservable, runInAction } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

import { Dalle, DalleTaskType, SuccessfulDalleTask } from '../dalle';
import { Task } from './models';

export class DalleStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    makePersistable(this, {
      name: 'AuthStore',
      properties: [
        //
        'authToken',
        'tasks',
      ],
    });

    autorun(() => {
      this.dalle.authToken = this.authToken;
    });
  }

  readonly dalle = new Dalle();

  authToken: string | null = null;
  get isSignedIn() {
    this.authToken; // observe
    return !!this.dalle.isSignedIn;
  }
  signIn(authToken: string) {
    this.authToken = authToken;
  }
  signOut() {
    this.authToken = null;
  }

  // newest first
  tasks: Task[] = [];
  get generationTasks(): Task[] {
    return this.tasks.filter(t => t.type === DalleTaskType.Generation);
  }
  get inpaintingTasks(): Task[] {
    return this.tasks.filter(t => t.type === DalleTaskType.Inpainting);
  }
  getTaskById(id: string): Task | undefined {
    return this.tasks.find(t => t.id === id);
  }
  async addTask(dto: SuccessfulDalleTask): Promise<Task> {
    let task = this.getTaskById(dto.id);

    if (task) {
      console.warn('Tried to add task that already exists', { dto });
      return task;
    }

    [task] = await Task.fromDtos(this.dalle, dto);

    runInAction(() => {
      this.tasks.unshift(task!);
    });

    return task;
  }
}
