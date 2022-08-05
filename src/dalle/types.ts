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

  prompt_type: PromptType;
  prompt: Prompt;

  parent_generation_id: string | null;
}

export type PromptType = 'CaptionPrompt' | 'ImageCaptionPrompt';

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

  task_type: string;

  status: TaskStatus;
  status_information: {};

  prompt: PromptMeta;
  prompt_id: string;
}

export interface PendingTask extends BaseTask {
  status: 'pending';
}

export interface SuccessfulTask extends BaseTask {
  status: 'succeeded';
  generations: DalleList<GenerationMeta>;
}

export interface FailedTask extends BaseTask {
  status: 'rejected';
}

export type TaskStatus = 'pending' | 'succeeded' | 'rejected';

export interface GenerationMeta extends DalleObject {
  object: 'generation';

  generation_type: GenerationType;
  generation: Generation;

  prompt_id: string;
  task_id: string;
  is_public: boolean;
}

export type GenerationType = 'ImageGeneration';

export interface Generation {
  image_path: string;
}
