import { MouseEvent } from 'react';

import { Coordinates, ImageDataUrl, Rect, urlToImage } from '../utils';

export type CanvasWithContext = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
};

export function createCanvas({
  width,
  height,
}: {
  width: number;
  height: number;
}): CanvasWithContext {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  return {
    canvas,
    ctx: getContextOrFail(canvas),
  };
}

export function getContextOrFail(
  canvas: HTMLCanvasElement,
): CanvasRenderingContext2D {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context 2d');
  }

  return ctx;
}

export function clearCanvas(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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
  opacity,
}: {
  ctx: CanvasRenderingContext2D;
  path: Path2D;
  thickness: number;
  opacity: number;
}) {
  ctx.lineWidth = thickness;
  ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
  ctx.stroke(path);
}

export function getCanvasMouseCoordinates(
  canvas: HTMLCanvasElement,
  e: MouseEvent,
): Coordinates {
  return {
    x: e.nativeEvent.offsetX,
    y: e.nativeEvent.offsetY,
  };
}
