import { Dalle, DalleGenerationMeta } from '../../dalle';

export interface Generation {
  id: string;
  promptId: string;
  taskId: string;
  image: string;
}

export namespace Generation {
  export const SIZE = 1024;
  export const DIMENSIONS = { width: SIZE, height: SIZE };
  export const DISPLAY_SIZE_MULTIPLE = 0.25;
  export const DISPLAY_SIZE = SIZE * DISPLAY_SIZE_MULTIPLE;

  export async function fromApi(
    dto: DalleGenerationMeta,
    dalle: Dalle,
  ): Promise<Generation> {
    return {
      id: dto.id,
      promptId: dto.prompt_id,
      taskId: dto.task_id,
      image: await dalle.getImageBase64(dto.generation.image_path),
    };
  }
}
