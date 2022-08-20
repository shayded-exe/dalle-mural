import { ImageBase64 } from '../utils';

export interface DalleObject {
  id: string;
  created: number;
}

export interface DalleList<T> {
  object: 'list';

  data: T[];
}

export interface DallePromptMeta extends DalleObject {
  object: 'prompt';

  prompt_type: DallePromptType;
  prompt: DallePrompt;

  parent_generation_id: string | null;
}

export type DallePromptType = 'CaptionPrompt' | 'ImageCaptionPrompt';

export interface DallePrompt {
  caption: string;
  image_path?: string;
  masked_image_path?: string;
}

export interface NewDallePrompt {
  batch_size: number;
  caption: string;
}

export interface NewInpaintingDallePrompt extends NewDallePrompt {
  masked_image: ImageBase64;
  image?: ImageBase64;
  parent_generation_id?: string;
}

export interface NewText2ImageDalleTask {
  task_type: 'text2im';
  prompt: NewDallePrompt;
}

export interface NewInpaintingDalleTask {
  task_type: 'inpainting';
  prompt: NewInpaintingDallePrompt;
}

export type DalleTask = PendingDalleTask | SuccessfulDalleTask | FailedDalleTask;

export interface BaseDalleTask extends DalleObject {
  object: 'task';

  task_type: string;

  status: DalleTaskStatus;
  status_information: {};

  prompt: DallePromptMeta;
  prompt_id: string;
}

export interface PendingDalleTask extends BaseDalleTask {
  status: 'pending';
}

export interface SuccessfulDalleTask extends BaseDalleTask {
  status: 'succeeded';
  generations: DalleList<DalleGenerationMeta>;
}

export interface FailedDalleTask extends BaseDalleTask {
  status: 'rejected';
}

export type DalleTaskStatus = 'pending' | 'succeeded' | 'rejected';

export interface DalleGenerationMeta extends DalleObject {
  object: 'generation';

  generation_type: DalleGenerationType;
  generation: DalleGeneration;

  prompt_id: string;
  task_id: string;
  is_public: boolean;
}

export type DalleGenerationType = 'ImageGeneration';

export interface DalleGeneration {
  image_path: string;
}
