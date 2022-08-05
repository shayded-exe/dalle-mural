import { Dalle as DalleApi, NewInpaintingTask, Task } from 'dalle-node';
import got from 'got';

export class Dalle extends DalleApi {
  signIn(bearerToken: string) {
    this.bearerToken = bearerToken;
  }

  async generateInpainting({
    prompt,
    maskedImage,
    parentGenerationId,
  }: {
    prompt: string;
    maskedImage: string;
    parentGenerationId: string;
  }): Promise<any> {
    const newTask: NewInpaintingTask = {
      task_type: 'inpainting',
      prompt: {
        caption: prompt,
        masked_image: maskedImage,
        parent_generation_id: parentGenerationId,
        batch_size: 3,
      },
    };

    return got
      .post(`${this.url}/tasks`, {
        json: newTask,
        headers: this.#getHeaders(),
      })
      .json<Task>()
      .then(task => this.#pollTask(task));
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
      Authorization: `Bearer ${this.bearerToken}`,
    };
  }
}
