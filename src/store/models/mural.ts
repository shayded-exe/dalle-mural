import * as uuid from 'uuid';

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
}

export interface MuralCoords {
  x: number;
  y: number;
}

export type ResizeAnchor = [
  'left' | 'center' | 'right',
  'top' | 'center' | 'bottom',
];
