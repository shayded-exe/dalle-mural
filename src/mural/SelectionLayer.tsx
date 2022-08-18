import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

import { clearCanvas, strokePath, useCanvas } from '../canvas';
import { models } from '../store';
import { Rect, urlToImage } from '../utils';

export const SelectionLayer = observer(_SelectionLayer);

function _SelectionLayer({
  selection,
  previewGeneration,
  ...passthrough
}: {
  selection: Rect | null;
  previewGeneration: models.Generation | null;
}) {
  const { ref, ctx } = useCanvas();
  const { previewImage } = usePreviewImage(previewGeneration);

  useEffect(
    function draw() {
      if (!ctx) {
        return;
      }

      clearCanvas(ctx);

      if (selection) {
        drawSelectionLayer({ ctx, selection, previewImage });
      }
    },
    [ctx, selection, previewGeneration],
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
  selection,
  previewImage,
}: {
  ctx: CanvasRenderingContext2D;
  selection: Rect;
  previewImage: HTMLImageElement | null;
}) {
  const path = new Path2D();
  const { x, y, width, height } = selection;

  if (previewImage) {
    ctx.drawImage(previewImage, x, y, width, height);
  } else {
    path.rect(x, y, width, height);
    strokePath({
      ctx,
      path,
      thickness: 3,
      opacity: 0.9,
    });
  }
}

function usePreviewImage(previewGeneration: models.Generation | null) {
  const [previewImage, setPreviewImage] = useState<HTMLImageElement | null>(null);

  useEffect(
    function updatePreviewImage() {
      if (previewGeneration) {
        urlToImage(previewGeneration.image).then(setPreviewImage);
      } else {
        setPreviewImage(null);
      }
    },
    [previewGeneration],
  );

  return { previewImage };
}
