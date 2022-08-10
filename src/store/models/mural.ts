import * as uuid from 'uuid';

import { createCanvas, ImageDataUrl, urlToImage } from '../../utils';
import { Generation } from './generation';

export interface Mural {
  id: string;
  width: number;
  height: number;
  overlap: number;
  // [x][y]
  generations: (Generation | null)[][];
}

export namespace Mural {
  export function create(): Mural {
    const width = 3;
    const height = 3;

    return {
      id: uuid.v4(),
      width,
      height,
      overlap: 1 / 8,
      generations: Array(width)
        .fill(0)
        .map(() => Array(height).fill(null)),
    };
  }

  export async function rasterize(mural: Mural): Promise<ImageDataUrl> {
    const width = mural.width * Generation.SIZE;
    const height = mural.height * Generation.SIZE;

    const { canvas, ctx } = createCanvas({ width, height });

    for (const [x, col] of mural.generations.entries()) {
      for (const [y, generation] of col.entries()) {
        if (!generation) {
          continue;
        }

        const image = await urlToImage(generation.image);
        ctx.drawImage(image, x * Generation.SIZE, y * Generation.SIZE);
      }
    }

    return canvas.toDataURL() as ImageDataUrl;
  }
}

export interface MuralCoords {
  x: number;
  y: number;
}

export type ResizeAnchor = [
  'left' | 'center' | 'right',
  'top' | 'center' | 'bottom',
];
