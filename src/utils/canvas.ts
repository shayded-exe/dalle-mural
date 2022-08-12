export type CanvasWithCtx = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
};

export function createCanvas({
  width,
  height,
}: {
  width: number;
  height: number;
}): CanvasWithCtx {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  return {
    canvas,
    ctx: canvas.getContext('2d')!,
  };
}
