import * as uuid from 'uuid';

import {
  CanvasWithCtx,
  createCanvas,
  ImageDataUrl,
  urlToImage,
} from '../../utils';
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
    const { canvas } = await buildCanvas(mural);

    return canvas.toDataURL() as ImageDataUrl;
  }

  export async function rasterizeTile({
    mural,
    x,
    y,
  }: { mural: Mural } & MuralCoords): Promise<ImageDataUrl> {
    const src = await buildCanvas(mural);
    const dest = createCanvas(Generation.DIMENSIONS);

    const size = Generation.SIZE;
    const overlap = mural.overlap;
    const sourceX = getPixelOffset({ index: x, overlap });
    const sourceY = getPixelOffset({ index: y, overlap });

    dest.ctx.drawImage(
      src.canvas,
      sourceX,
      sourceY,
      size,
      size,
      0,
      0,
      size,
      size,
    );

    return dest.canvas.toDataURL() as ImageDataUrl;
  }

  async function buildCanvas(mural: Mural): Promise<CanvasWithCtx> {
    const overlap = mural.overlap;
    const sizeMinusOverlap = getSizeMinusOverlap(overlap);

    const { canvas, ctx } = createCanvas({
      width: (mural.width - 1) * sizeMinusOverlap + Generation.SIZE,
      height: (mural.height - 1) * sizeMinusOverlap + Generation.SIZE,
    });

    for (const [x, col] of mural.generations.entries()) {
      for (const [y, generation] of col.entries()) {
        if (!generation) {
          continue;
        }

        const image = await urlToImage(generation.image);
        const px = getPixelOffset({ index: x, overlap });
        const py = getPixelOffset({ index: y, overlap });
        ctx.drawImage(image, px, py);
      }
    }

    return { canvas, ctx };
  }

  function getSizeMinusOverlap(overlap: number): number {
    const overlapPx = overlap * Generation.SIZE;

    return Generation.SIZE - overlapPx;
  }

  function getPixelOffset({
    index,
    overlap,
  }: {
    index: number;
    overlap: number;
  }): number {
    return index * getSizeMinusOverlap(overlap);
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
