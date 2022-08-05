declare module 'dalle-node' {
  export interface DalleObject {
    id: string;
    created: number;
  }

  export interface DalleList<T> {
    object: 'list';

    data: T[];
  }

  export interface PromptMeta extends DalleObject {
    object: 'prompt';

    parent_generation_id: string | null;
    prompt_type: string;
  }

  export interface Prompt {
    caption: string;
    image_path?: string;
    masked_image_path?: string;
  }

  export interface NewPrompt {
    batch_size: number;
    caption: string;
  }

  export interface NewInpaintingPrompt extends NewPrompt {
    masked_image: string;
    parent_generation_id: string;
  }

  export interface NewText2ImageTask {
    task_type: 'text2im';
    prompt: NewPrompt;
  }

  export interface NewInpaintingTask {
    task_type: 'inpainting';
    prompt: NewInpaintingPrompt;
  }

  export type Task = PendingTask | SuccessfulTask | FailedTask;

  export interface BaseTask extends DalleObject {
    object: 'task';

    prompt: object;
    prompt_id: string;
    status: TaskStatus;
    status_information: object;
    task_type: string;
  }

  export interface PendingTask extends BaseTask {
    status: 'pending';
  }

  export interface SuccessfulTask extends BaseTask {
    status: 'succeeded';
    generations: DalleList<Generation>;
  }

  export interface FailedTask extends BaseTask {
    status: 'rejected';
  }

  export type TaskStatus = 'pending' | 'succeeded' | 'rejected';

  export interface Generation extends DalleObject {
    object: 'generation';

    generation_type: string;
    generation: {
      image_path: string;
    };
    prompt_id: string;
    task_id: string;
    is_public: boolean;
  }

  export class Dalle {
    bearerToken: string;
    url: string;

    constructor(bearerToken: string);

    async generate(prompt: string): Promise<Task>;
    async getTask(taskId: string): Promise<Task>;
    async list(options = { limit: 50, fromTs: 0 }): Promise<Task[]>;
    async getCredits(): Promise<any>;
  }
}
