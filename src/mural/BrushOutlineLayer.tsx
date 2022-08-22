import {
  Brush,
  buildBrushPath,
  clearCanvas,
  strokePath,
  useCanvasDraw,
} from '../canvas';

export function BrushOutlineLayer({ brush, ...passthrough }: { brush: Brush | null }) {
  const { ref } = useCanvasDraw(
    ctx => {
      clearCanvas(ctx);

      if (brush) {
        drawBrushOutline({ ctx, brush });
      }
    },
    [brush],
  );

  return (
    <canvas
      ref={ref}
      {...passthrough}
    ></canvas>
  );
}

function drawBrushOutline({
  ctx,
  brush,
}: {
  ctx: CanvasRenderingContext2D;
  brush: Brush;
}) {
  strokePath({
    ctx,
    path: buildBrushPath(brush),
    thickness: 4,
    opacity: 0.9,
  });
}
