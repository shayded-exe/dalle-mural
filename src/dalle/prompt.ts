import { ImageBase64 } from '../utils';
import { DalleId, DalleObject } from './types';

export interface DallePromptMeta extends DalleObject {
  object: 'prompt';

  prompt_type: DallePromptType;
  prompt: DallePrompt;

  parent_generation_id: DalleId | null;
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
  image: ImageBase64;
  parent_generation_id?: DalleId;
}
