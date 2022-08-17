import * as uuid from 'uuid';

import { CanvasWithContext, createCanvas } from '../../canvas';
import {
  Coordinates,
  Dimensions,
  ImageDataUrl,
  Rect,
  urlToImage,
} from '../../utils';
import { Generation } from './generation';

export interface Mural extends Dimensions {
  id: string;
  items: Mural.Item[];

  widthSquares: number;
  heightSquares: number;

  gridOverlapRatio: number;
  gridSubdivideRatio: number;
}

export namespace Mural {
  export type Item = GenerationItem | ImageItem | EraseItem;

  export interface BaseItem extends Rect {
    id: string;
    type: string;
  }

  export interface GenerationItem extends BaseItem {
    type: 'generation';
    generation: Generation;
  }

  export interface ImageItem extends BaseItem {
    type: 'image';
    image: ImageDataUrl;
  }

  export interface EraseItem extends BaseItem {
    type: 'erase';
    mask: ImageDataUrl;
  }

  export function create({
    widthSquares = 3,
    heightSquares = 3,
    overlapRatio = 1 / 8,
  }: {
    widthSquares?: number;
    heightSquares?: number;
    overlapRatio?: number;
  } = {}): Mural {
    return {
      id: uuid.v4(),
      items: [],
      gridOverlapRatio: overlapRatio,
      gridSubdivideRatio: 1 / 8,
      widthSquares,
      heightSquares,
      ...getDimensions(),
    };

    function getDimensions(): Dimensions {
      return {
        width: getDimension(widthSquares),
        height: getDimension(heightSquares),
      };
    }

    function getDimension(items: number): number {
      const overlap = (items - 1) * Generation.SIZE * overlapRatio;

      return items * Generation.SIZE - overlap;
    }
  }

  export function getPixelOffset({
    index,
    size,
    overlapRatio,
  }: {
    index: number;
    size: number;
    overlapRatio: number;
  }): number {
    return index * (size - overlapRatio * size);
  }
}

// old stuff

export interface DomMural {
  id: string;
  width: number;
  height: number;
  overlap: number;
  // [x][y]
  generations: (Generation | null)[][];
}

export namespace DomMural {
  export function create(): DomMural {
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

  export async function rasterizeTile({
    mural,
    x,
    y,
  }: { mural: DomMural } & Coordinates): Promise<ImageDataUrl> {
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

  async function buildCanvas(mural: DomMural): Promise<CanvasWithContext> {
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
