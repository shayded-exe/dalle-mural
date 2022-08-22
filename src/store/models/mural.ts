import * as uuid from 'uuid';

import { Dimensions, Rect } from '../../canvas';
import { ImageDataUrl } from '../../utils';
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
