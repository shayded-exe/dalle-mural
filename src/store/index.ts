import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { createContext, useContext } from 'react';

import { GenerationMeta, Task } from '../dalle';

export interface PlacedGeneration extends GenerationMeta {
  x: number;
  y: number;
}

export class DalleStore {
  authToken = '';

  tasks: Task[] = [];
  resultGenerations: GenerationMeta[] = [];
  placedGenerations: PlacedGeneration[] = [];

  constructor() {
    makeAutoObservable(this);
    makePersistable(
      this,
      {
        name: 'DalleStore',
        properties: [
          //
          'authToken',
          'tasks',
          'resultGenerations',
          'placedGenerations',
        ],
        storage: window.localStorage,
      },
      {
        delay: 1000,
      },
    );
  }

  setAuthToken(authToken: string) {
    this.authToken = authToken;
  }

  addTask(task: Task) {
    if (task.status === 'rejected') {
      console.warn('Task failed', { task });
    }

    this.tasks.push(task);
  }

  loadResults(generations: GenerationMeta[]) {
    this.resultGenerations = generations;
  }

  placeGeneration({
    generation,
    ...coords
  }: {
    generation: GenerationMeta;
    x: number;
    y: number;
  }) {
    this.placedGenerations.push({
      ...generation,
      ...coords,
    });
  }
}

export const dalleStoreContext = createContext(new DalleStore());

export const useStore = () => useContext(dalleStoreContext);
