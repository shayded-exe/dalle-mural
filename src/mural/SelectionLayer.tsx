import { observer } from 'mobx-react-lite';

import { clearCanvas, Path2DBuilder, Rect, strokePath, useCanvasDraw } from '../canvas';
import { models } from '../store';
import { usePreviewImage } from './use-preview-image';

export const SelectionLayer = observer(_SelectionLayer);

function _SelectionLayer({
  selection,
  isSelected,
  selectedGeneration,
  ...passthrough
}: {
  selection: Rect | null;
  isSelected: boolean;
  selectedGeneration: models.Generation | null;
}) {
  const { previewImage } = usePreviewImage(selectedGeneration);

  const { ref } = useCanvasDraw(
    ctx => {
      clearCanvas(ctx);

      if (selection) {
        drawSelectionLayer({ ctx, selection, isSelected, previewImage }).catch(
          console.error,
        );
      }
    },
    [selection, isSelected, previewImage],
  );

  return (
    <canvas
      ref={ref}
      {...passthrough}
    />
  );
}

async function drawSelectionLayer({
  ctx,
  selection: { x, y, width, height },
  isSelected,
  previewImage,
}: {
  ctx: CanvasRenderingContext2D;
  selection: Rect;
  isSelected: boolean;
  previewImage: HTMLImageElement | null;
}) {
  if (previewImage) {
    ctx.drawImage(previewImage, x, y, width, height);
  }

  if (isSelected) {
    strokePath({
      ctx,
      path: new Path2DBuilder().rect(x, y, width, height).path,
      thickness: 6,
      strokeStyle: 'rgb(66, 153, 225)',
    });
  } else if (!previewImage) {
    strokePath({
      ctx,
      path: new Path2DBuilder().rect(x, y, width, height).path,
      thickness: 4,
      opacity: 0.9,
    });
  }
}
