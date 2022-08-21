import { Opaque } from 'type-fest';

export type ImageBase64 = Opaque<string, 'ImageBase64'>;
export type ImageDataUrl = Opaque<string, 'ImageDataUrl'>;

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

export type ResizeAnchor = ['left' | 'center' | 'right', 'top' | 'center' | 'bottom'];
