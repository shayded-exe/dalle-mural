import { Dalle, DalleGenerationMeta } from '../../dalle';

export interface Generation {
  id: string;
  promptId: string;
  taskId: string;
  image: string;
}

export namespace Generation {
  export const SIZE = 1024;

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
