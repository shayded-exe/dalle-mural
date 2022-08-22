export interface Coordinates {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export namespace Dimensions {
  export function fromSize(size: number): Dimensions {
    return { width: size, height: size };
  }
}

export type Rect = Coordinates & Dimensions;

export interface CircleSize {
  radius: number;
}

export type Circle = Coordinates & CircleSize;

export type ResizeAnchor = [
  //
  'left' | 'center' | 'right',
  'top' | 'center' | 'bottom',
];
