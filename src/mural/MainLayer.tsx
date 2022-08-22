import { useMergeRefs } from '@chakra-ui/react';
import { autorun } from 'mobx';
import { observer } from 'mobx-react-lite';

import { clearCanvas, drawImageUrl, useCanvasDraw } from '../canvas';
import { models } from '../store';

export const MainLayer = observer(_MainLayer);

function _MainLayer({
  mural,
  canvasRef,
  ...passthrough
}: {
  mural: models.Mural;
  canvasRef?: React.Ref<HTMLCanvasElement>;
}) {
  const { ref: _ref } = useCanvasDraw(ctx =>
    autorun(() => {
      clearCanvas(ctx);
      drawMainLayer({ ctx, mural }).catch(console.error);
    }),
  );

  return (
    <canvas
      ref={useMergeRefs(_ref, canvasRef)}
      {...passthrough}
    />
  );
}

async function drawMainLayer({
  ctx,
  mural,
}: {
  ctx: CanvasRenderingContext2D;
  mural: models.Mural;
}) {
  for (const item of mural.items) {
    await drawItem(item);
  }

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
