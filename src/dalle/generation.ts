import { DalleId, DalleObject } from './types';

export interface DalleGenerationMeta extends DalleObject {
  object: 'generation';

  generation_type: DalleGenerationType;
  generation: DalleGeneration;

  prompt_id: DalleId;
  task_id: DalleId;
  is_public: boolean;
}

export type DalleGenerationType = 'ImageGeneration';

export interface DalleGeneration {
  image_path: string;
}
