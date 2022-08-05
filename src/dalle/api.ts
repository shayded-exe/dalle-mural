import ky from 'ky';

import { NewInpaintingTask, NewText2ImageTask, Task } from './types';

export class Dalle {
  readonly url = 'https://labs.openai.com/api/labs';

  authToken?: string;

  get isSignedIn(): boolean {
    // TODO: Check expiration
    return !!this.authToken;
  }

  constructor(authToken?: string) {
    this.authToken = authToken;
  }

  async generate({ prompt }: { prompt: string }): Promise<Task> {
    const newTask: NewText2ImageTask = {
      task_type: 'text2im',
      prompt: {
        caption: prompt,
        batch_size: 4,
      },
    };

    return ky
      .post(`${this.url}/tasks`, {
        json: newTask,
        headers: this.#getHeaders(),
      })
      .json<Task>()
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
  }): Promise<Task> {
    const newTask: NewInpaintingTask = {
      task_type: 'inpainting',
      prompt: {
        caption: prompt,
        masked_image: maskedImage,
        parent_generation_id: parentGenerationId,
        batch_size: 3,
      },
    };

    return ky
      .post(`${this.url}/tasks`, {
        json: newTask,
        headers: this.#getHeaders(),
      })
      .json<Task>()
      .then(task => this.#pollTask(task));
  }

  async getTask(taskId: string): Promise<Task> {
    return ky
      .post(`${this.url}/tasks/${taskId}`, {
        headers: this.#getHeaders(),
      })
      .json<Task>();
  }

  #pollTask(task: Task): Promise<Task> {
    return new Promise<Task>((resolve, reject) => {
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
