import { Dalle, DalleGenerationMeta, DalleId } from '../../dalle';
import { Dimensions, ImageDataUrl } from '../../utils';

export interface Generation {
  id: DalleId;
  image: ImageDataUrl;
  createdAt: number;
}

export namespace Generation {
  export const SIZE = 1024;
  export const DIMENSIONS = Dimensions.fromSize(SIZE);
  export const DISPLAY_SIZE = `${SIZE / 4}px`;
  export const MIN_DISPLAY_SIZE = `${SIZE / 8}px`;

  export async function fromDtos(
    dalle: Dalle,
    ...dtos: DalleGenerationMeta[]
  ): Promise<Generation[]> {
    return await Promise.all(dtos.map(fromDto));

    async function fromDto({
      id,
      created,
      generation: { image_path },
    }: DalleGenerationMeta): Promise<Generation> {
      return {
        id,
        image: await dalle.getImageBase64(image_path),
        createdAt: created,
      };
    }
  }
}
