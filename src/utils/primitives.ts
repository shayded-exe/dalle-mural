import { Opaque } from 'type-fest';

export type ImageDataUrl = Opaque<string, 'ImageDataUrl'>;

export interface Coordinates {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export type Rect = Coordinates & Dimensions;

export type ResizeAnchor = [
  'left' | 'center' | 'right',
  'top' | 'center' | 'bottom',
];
