import React from 'react';

import { ImageDataUrl, urlToImage } from '../utils';
import { Coordinates, Dimensions, Rect } from './primitives';

export type CanvasWithContext = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
};

export function createCanvas({ width, height }: Dimensions): CanvasWithContext {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  return {
    canvas,
    ctx: getContextOrFail(canvas),
  };
}

export function getContextOrFail(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context 2d');
  }

  return ctx;
}

export function clearCanvas(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

export function canvasToImage(
  canvasOrCtx: HTMLCanvasElement | CanvasRenderingContext2D,
): ImageDataUrl {
  const canvas = 'canvas' in canvasOrCtx ? canvasOrCtx.canvas : canvasOrCtx;

  return canvas.toDataURL('image/png') as ImageDataUrl;
}

export function cropCanvasToImage({
  canvas,
  rect,
}: {
  canvas: HTMLCanvasElement;
  rect: Rect;
}): ImageDataUrl {
  const dest = createCanvas(rect);

  dest.ctx.drawImage(
    canvas,
    rect.x,
    rect.y,
    rect.width,
    rect.height,
    0,
    0,
    rect.width,
    rect.height,
  );

  return canvasToImage(dest.canvas);
}

export async function drawImageUrl({
  ctx,
  imageUrl,
  rect,
}: {
  ctx: CanvasRenderingContext2D;
  imageUrl: ImageDataUrl;
  rect: Rect;
}) {
  const image = await urlToImage(imageUrl);

  ctx.drawImage(image, rect.x, rect.y, rect.width, rect.height);
}

export function strokePath({
  ctx,
  path,
  thickness,
  strokeStyle,
  opacity = 1,
}: {
  ctx: CanvasRenderingContext2D;
  path: Path2D;
  thickness: number;
  strokeStyle?: string;
  opacity?: number;
}) {
  ctx.lineWidth = thickness;
  ctx.strokeStyle = strokeStyle || `rgba(0, 0, 0, ${opacity})`;
  ctx.stroke(path);
}

export function getCanvasMouseCoordinates(e: React.MouseEvent): Coordinates {
  return {
    x: e.nativeEvent.offsetX,
    y: e.nativeEvent.offsetY,
  };
}
