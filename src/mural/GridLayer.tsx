import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';

import { clearCanvas, Path2DBuilder, strokePath, useCanvasDraw } from '../canvas';
import { models } from '../store';

export const GridLayer = observer(_GridLayer);

function _GridLayer({
  mural,
  isVisible = true,
  ...passthrough
}: {
  mural: models.Mural;
  isVisible?: boolean;
}) {
  const { ref } = useCanvasDraw(
    ctx =>
      reaction(
        () => mural,
        () => {
          clearCanvas(ctx);

          if (isVisible) {
            drawGridLayer({ ctx, mural });
          }
        },
        { fireImmediately: true },
      ),
    [mural, isVisible],
  );

  return (
    <canvas
      ref={ref}
      {...passthrough}
    />
  );
}

function drawGridLayer({
  ctx,
  mural,
}: {
  ctx: CanvasRenderingContext2D;
  mural: models.Mural;
}) {
  const {
    width,
    height,
    widthSquares,
    heightSquares,
    gridOverlapRatio,
    gridSubdivideRatio,
  } = mural;

  strokePath({
    ctx,
    path: buildMainPath(),
    thickness: 6,
    opacity: 0.1,
  });

  if (gridSubdivideRatio < 1) {
    strokePath({
      ctx,
      path: buildSubdividedPath(),
      thickness: 4,
      opacity: 0.1,
    });
  }

  ctx.globalCompositeOperation = 'destination-out';
  strokePath({
    ctx,
    path: new Path2DBuilder().rect(0, 0, width - 1, height - 1).path,
    thickness: 6,
    opacity: 1,
  });
  ctx.globalCompositeOperation = 'source-over';

  function buildMainPath(): Path2D {
    const squareSize = models.Generation.SIZE;
    const path = new Path2D();

    for (let x = 0; x < widthSquares; x++) {
      for (let y = 0; y < heightSquares; y++) {
        const px = getOffset(x, squareSize);
        const py = getOffset(y, squareSize);

        path.rect(px, py, squareSize, squareSize);
      }
    }

    return path;
  }

  function buildSubdividedPath(): Path2D {
    const squareSize = models.Generation.SIZE * gridSubdivideRatio;
    const path = new Path2D();

    for (let x = 0; x < width / squareSize; x++) {
      for (let y = 0; y < height / squareSize; y++) {
        const px = squareSize * x;
        const py = squareSize * y;

        path.rect(px, py, squareSize, squareSize);
      }
    }

    return path;
  }

  function getOffset(index: number, size: number) {
    return models.Mural.getPixelOffset({
      index,
      size,
      overlapRatio: gridOverlapRatio,
    });
  }
}
