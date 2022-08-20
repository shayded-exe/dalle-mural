import { observer } from 'mobx-react-lite';

import { clearCanvas, Path2DBuilder, strokePath, useCanvasDraw } from '../canvas';
import { models } from '../store';
import { Rect } from '../utils';
import { usePreviewImage } from './use-preview-image';

export const SelectionLayer = observer(_SelectionLayer);

function _SelectionLayer({
  selection,
  isSelected,
  previewGeneration,
  ...passthrough
}: {
  selection: Rect | null;
  isSelected: boolean;
  previewGeneration: models.Generation | null;
}) {
  const { previewImage } = usePreviewImage(previewGeneration);
  const { ref } = useSelectionLayer({ selection, isSelected, previewImage });

  return (
    <canvas
      ref={ref}
      {...passthrough}
    />
  );
}

function useSelectionLayer({
  selection,
  ...args
}: {
  selection: Rect | null;
  isSelected: boolean;
  previewImage: HTMLImageElement | null;
}) {
  return useCanvasDraw(
    ctx => {
      clearCanvas(ctx);

      if (selection) {
        drawSelectionLayer({ ctx, selection, ...args });
      }
    },
    [selection, ...Object.values(args)],
  );
}

async function drawSelectionLayer({
  ctx,
  selection,
  isSelected,
  previewImage,
}: {
  ctx: CanvasRenderingContext2D;
  selection: Rect;
  isSelected: boolean;
  previewImage: HTMLImageElement | null;
}) {
  const { x, y, width, height } = selection;

  if (previewImage) {
    ctx.drawImage(previewImage, x, y, width, height);
  }

  if (isSelected) {
    strokePath({
      ctx,
      path: new Path2DBuilder().rect(x, y, width, height).path,
      thickness: 7,
      strokeStyle: 'rgb(66, 153, 225)',
    });
  } else if (!previewImage) {
    strokePath({
      ctx,
      path: new Path2DBuilder().rect(x, y, width, height).path,
      thickness: 3,
      opacity: 0.9,
    });
  }
}
