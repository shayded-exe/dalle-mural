import ky from 'ky';

import { ImageDataUrl, imageDataUrlToBase64, urlToImageDataUrl_fetch } from '../utils';
import {
  DalleTask,
  DalleTaskStatus,
  DalleTaskType,
  NewInpaintingDalleTask,
  NewText2ImageDalleTask,
  SuccessfulDalleTask,
} from './task';
import { DalleId } from './types';

export const DALLE_AUTH_TOKEN_LENGTH = 45;

export class Dalle {
  authToken: string | null;

  get isSignedIn(): boolean {
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
    this.authToken = authToken ?? null;
  }

  async generate({ prompt }: { prompt: string }): Promise<SuccessfulDalleTask> {
    const newTask: NewText2ImageDalleTask = {
      task_type: DalleTaskType.Generation,
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
      .then(task => this.#pollTask(task))
      .then(rejectIfTaskNotSuccessful);
  }

  async generateInpainting({
    prompt,
    maskedImage,
    sourceImage,
    parentGenerationId,
  }: {
    prompt: string;
    maskedImage: ImageDataUrl;
    sourceImage: ImageDataUrl;
    parentGenerationId?: DalleId;
  }): Promise<SuccessfulDalleTask> {
    const newTask: NewInpaintingDalleTask = {
      task_type: DalleTaskType.Inpainting,
      prompt: {
        caption: prompt,
        masked_image: imageDataUrlToBase64(maskedImage),
        image: imageDataUrlToBase64(sourceImage),
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
      .then(task => this.#pollTask(task))
      .then(rejectIfTaskNotSuccessful);
  }

  async getTask(taskId: string): Promise<DalleTask> {
    return ky
      .get(`${this.#apiUrl}/tasks/${taskId}`, {
        headers: this.#getHeaders(),
      })
      .json<DalleTask>();
  }

  async getSuccessfulTask(taskId: string): Promise<SuccessfulDalleTask> {
    return this.getTask(taskId).then(rejectIfTaskNotSuccessful);
  }

  async getImageBase64(dalleUrl: string): Promise<ImageDataUrl> {
    const { pathname, search } = new URL(dalleUrl);
    const url = [this.#imagesUrl, pathname, search].join('');

    return urlToImageDataUrl_fetch(url);
  }

  #pollTask(task: DalleTask): Promise<DalleTask> {
    return new Promise(resolve => {
      const refreshIntervalId = setInterval(async () => {
        await this.getTask(task.id)
          .then(newTask => (task = newTask))
          .catch(console.warn);

        if (task.status === DalleTaskStatus.Pending) {
          return;
        }

        clearInterval(refreshIntervalId);
        resolve(task);
      }, 2000);
    });
  }

  #getHeaders() {
    return {
      Authorization: `Bearer ${this.authToken}`,
    };
  }
}

async function rejectIfTaskNotSuccessful(
  task: DalleTask,
): Promise<SuccessfulDalleTask> {
  return new Promise((resolve, reject) => {
    if (task.status === DalleTaskStatus.Succeeded) {
      resolve(task);
    } else {
      reject(task);
    }
  });
}
