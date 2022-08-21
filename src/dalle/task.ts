import { DalleGenerationMeta } from './generation';
import { DallePromptMeta, NewDallePrompt, NewInpaintingDallePrompt } from './prompt';
import { DalleList, DalleObject } from './types';

export enum DalleTaskType {
  Generation = 'text2im',
  Inpainting = 'inpainting',
}

export enum DalleTaskStatus {
  Pending = 'pending',
  Succeeded = 'succeeded',
  Rejected = 'rejected',
}

export type DalleTask = PendingDalleTask | SuccessfulDalleTask | FailedDalleTask;

export interface BaseDalleTask extends DalleObject {
  object: 'task';

  task_type: DalleTaskType;

  status: DalleTaskStatus;
  status_information: {};

  prompt: DallePromptMeta;
  prompt_id: string;
}

export interface PendingDalleTask extends BaseDalleTask {
  status: DalleTaskStatus.Pending;
}

export interface SuccessfulDalleTask extends BaseDalleTask {
  status: DalleTaskStatus.Succeeded;
  generations: DalleList<DalleGenerationMeta>;
}

export interface FailedDalleTask extends BaseDalleTask {
  status: DalleTaskStatus.Rejected;
}

export interface NewText2ImageDalleTask {
  task_type: DalleTaskType.Generation;
  prompt: NewDallePrompt;
}

export interface NewInpaintingDalleTask {
  task_type: DalleTaskType.Inpainting;
  prompt: NewInpaintingDallePrompt;
}
