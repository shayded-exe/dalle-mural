import { useMergeRefs } from '@chakra-ui/react';

import { Brush, buildBrushPath, useCanvasDraw } from '../canvas';

export function BrushFillLayer({
  brush,
  isPainting,
  canvasRef,
  ...passthrough
}: {
  brush: Brush | null;
  isPainting: boolean;
  canvasRef?: React.Ref<HTMLCanvasElement>;
}) {
  const { ref: _ref } = useCanvasDraw(
    ctx => {
      if (brush && isPainting) {
        drawBrushFill({ ctx, brush });
      }
    },
    [brush, isPainting],
  );

  return (
    <canvas
      ref={useMergeRefs(_ref, canvasRef)}
      {...passthrough}
    ></canvas>
  );
}

function drawBrushFill({
  ctx,
  brush,
}: {
  ctx: CanvasRenderingContext2D;
  brush: Brush;
}) {
  ctx.fillStyle = 'white';
  ctx.fill(buildBrushPath(brush));
}
