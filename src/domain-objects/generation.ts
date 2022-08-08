import { Dalle, DalleGenerationMeta } from '../dalle';

export class Generation {
  id!: string;
  promptId!: string;
  taskId!: string;
  image!: string;

  static async fromApi(
    dto: DalleGenerationMeta,
    dalle: Dalle,
  ): Promise<Generation> {
    const obj = new Generation();

    obj.id = dto.id;
    obj.promptId = dto.prompt_id;
    obj.taskId = dto.task_id;
    obj.image = await dalle.getImageBase64(dto.generation.image_path);

    return obj;
  }
}
