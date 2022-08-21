import { Dalle, DalleId, DalleTaskType, SuccessfulDalleTask } from '../../dalle';
import { ImageDataUrl } from '../../utils';
import { Generation } from './generation';

export interface Task {
  id: DalleId;
  type: DalleTaskType;

  caption: string;
  promptImage?: ImageDataUrl;
  parentGenerationId: string | null;

  generations: Generation[];

  createdAt: number;
}

export namespace Task {
  export async function fromDtos(
    dalle: Dalle,
    ...dtos: SuccessfulDalleTask[]
  ): Promise<Task[]> {
    return await Promise.all(dtos.map(fromDto));

    async function fromDto({
      id,
      task_type,
      created,
      prompt: {
        prompt: { caption, masked_image_path },
        parent_generation_id,
      },
      generations: { data: generationDtos },
    }: SuccessfulDalleTask): Promise<Task> {
      const promptImage = !masked_image_path
        ? undefined
        : await dalle.getImageBase64(masked_image_path);

      const generations = await Generation.fromDtos(dalle, ...generationDtos);

      return {
        id,
        type: task_type,
        caption,
        promptImage,
        parentGenerationId: parent_generation_id,
        generations,
        createdAt: created,
      };
    }
  }
}
