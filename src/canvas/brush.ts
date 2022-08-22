import { Path2DBuilder } from './path-2d-builder';
import { Circle, CircleSize, Dimensions, Rect } from './primitives';

export type Brush = Rect | Circle;

export enum BrushShape {
  Rect = 'rect',
  Circle = 'circle',
}

export type BrushSize = Dimensions | CircleSize;

export function isBrushCircle(brush: Brush): brush is Circle;
export function isBrushCircle(size: BrushSize): size is CircleSize;
export function isBrushCircle(brush: Brush | BrushSize): brush is Circle {
  return 'radius' in brush;
}

export function buildBrushPath(brush: Brush) {
  const pb = new Path2DBuilder();

  if (isBrushCircle(brush)) {
    pb.circle(brush.x, brush.y, brush.radius);
  } else {
    pb.rect(brush.x, brush.y, brush.width, brush.height);
  }

  return pb.path;
}
