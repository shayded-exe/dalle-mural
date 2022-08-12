import ky from 'ky';

import { urlToImageDataUrl_fetch } from '../utils';
import {
  DalleTask,
  NewInpaintingDalleTask,
  NewText2ImageDalleTask,
} from './types';

export const DALLE_AUTH_TOKEN_LENGTH = 45;

export class Dalle {
  authToken?: string;

  get isSignedIn(): boolean {
    // TODO: Check expiration
    return !!this.authToken;
  }

  readonly #url = 'http://localhost:5174';

  get #apiUrl() {
    return `${this.#url}/api`;
  }

  get #imagesUrl() {
    return `${this.#url}/images`;
  }

  constructor(authToken?: string) {
    this.authToken = authToken;
  }

  async generate({ prompt }: { prompt: string }): Promise<DalleTask> {
    const newTask: NewText2ImageDalleTask = {
      task_type: 'text2im',
      prompt: {
        caption: prompt,
        batch_size: 4,
      },
    };

    return ky
      .post(`${this.#apiUrl}/tasks`, {
        json: newTask,
        headers: this.#getHeaders(),
      })
      .json<DalleTask>()
      .then(task => this.#pollTask(task));
  }

  async generateInpainting({
    prompt,
    maskedImage,
    parentGenerationId,
  }: {
    prompt: string;
    maskedImage: string;
    parentGenerationId: string;
  }): Promise<DalleTask> {
    const newTask: NewInpaintingDalleTask = {
      task_type: 'inpainting',
      prompt: {
        caption: prompt,
        masked_image: maskedImage,
        parent_generation_id: parentGenerationId,
        batch_size: 3,
      },
    };

    return ky
      .post(`${this.#apiUrl}/tasks`, {
        json: newTask,
        headers: this.#getHeaders(),
      })
      .json<DalleTask>()
      .then(task => this.#pollTask(task));
  }

  async getTask(taskId: string): Promise<DalleTask> {
    return ky
      .get(`${this.#apiUrl}/tasks/${taskId}`, {
        headers: this.#getHeaders(),
      })
      .json<DalleTask>();
  }

  async getImageBase64(dalleUrl: string): Promise<string> {
    const { pathname, search } = new URL(dalleUrl);
    const url = [this.#imagesUrl, pathname, search].join('');

    return urlToImageDataUrl_fetch(url);
  }

  #pollTask(task: DalleTask): Promise<DalleTask> {
    return new Promise<DalleTask>((resolve, reject) => {
      const refreshIntervalId = setInterval(async () => {
        try {
          const newTask = await this.getTask(task.id);
          task = newTask;
        } catch {}

        if (task.status === 'pending') {
          return;
        }

        clearInterval(refreshIntervalId);

        if (task.status === 'succeeded') {
          resolve(task);
        } else {
          reject(task);
        }
      }, 2000);
    });
  }

  #getHeaders() {
    return {
      Authorization: `Bearer ${this.authToken}`,
    };
  }
}
