import { useMergeRefs } from '@chakra-ui/react';
import { autorun } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';

import { clearCanvas, drawImageUrl, useCanvasDraw } from '../canvas';
import { models } from '../store';

export const MainLayer = observer(_MainLayer);

function _MainLayer({
  mural,
  onPaint,
  canvasRef,
  ...passthrough
}: {
  mural: models.Mural;
  onPaint?: (ctx: CanvasRenderingContext2D) => void;
  canvasRef?: React.Ref<HTMLCanvasElement>;
}) {
  const lastItemDrawn = useRef(-1);
  // force clear when a new mural is loaded
  useEffect(() => {
    lastItemDrawn.current = Infinity;
  }, [mural]);

  const { ref: _ref } = useCanvasDraw(
    ctx =>
      autorun(() => {
        onDraw(ctx);
      }),
    [mural],
  );

  return (
    <canvas
      ref={useMergeRefs(_ref, canvasRef)}
      {...passthrough}
    />
  );

  function onDraw(ctx: CanvasRenderingContext2D) {
    // clear canvas if we had an undo or a new mural is loaded
    if (mural.items.length - 1 < lastItemDrawn.current) {
      clearCanvas(ctx);
      lastItemDrawn.current = -1;
    }

    drawMainLayer({ ctx, mural, lastItemDrawn: lastItemDrawn.current })
      .then(res => (lastItemDrawn.current = res.lastItemDrawn))
      .then(() => onPaint?.(ctx))
      .catch(console.error);
  }
}

async function drawMainLayer({
  ctx,
  mural,
  lastItemDrawn,
}: {
  ctx: CanvasRenderingContext2D;
  mural: models.Mural;
  lastItemDrawn: number;
}): Promise<{ lastItemDrawn: number }> {
  for (const [i, item] of mural.items.entries()) {
    if (i <= lastItemDrawn) {
      continue;
    }

    await drawItem(item);
    lastItemDrawn = i;
  }

  return { lastItemDrawn };

  async function drawItem(item: models.Mural.Item) {
    switch (item.type) {
      case 'generation':
        await drawGenerationItem(item);
        break;
      case 'image':
        await drawImageItem(item);
        break;
      case 'erase':
        await drawEraseItem(item);
        break;
      default:
        console.error('Mural item not recognized', { item });
    }
  }

  async function drawGenerationItem(item: models.Mural.GenerationItem) {
    await drawImageUrl({
      ctx,
      imageUrl: item.generation.image,
      rect: item,
    });
  }

  async function drawImageItem(item: models.Mural.ImageItem) {
    await drawImageUrl({
      ctx,
      imageUrl: item.image,
      rect: item,
    });
  }

  async function drawEraseItem(item: models.Mural.EraseItem) {
    ctx.globalCompositeOperation = 'destination-out';
    await drawImageUrl({
      ctx,
      imageUrl: item.mask,
      rect: item,
    });
    ctx.globalCompositeOperation = 'source-over';
  }
}
