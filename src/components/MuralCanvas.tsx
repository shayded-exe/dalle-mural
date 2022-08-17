import { useCallbackRef } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { MouseEvent, useEffect, useState } from 'react';
import { useDeepCompareMemoize } from 'use-deep-compare-effect';

import {
  CanvasWithContext,
  drawImageUrl,
  getCanvasMouseCoordinates,
  strokePath,
  useLayeredCanvas,
} from '../canvas';
import { models } from '../store';
import { Rect, urlToImage } from '../utils';

export const MuralCanvas = observer(_MuralCanvas);

enum CanvasLayer {
  Mural = 'mural',
  Grid = 'grid',
  Selection = 'selection',
}

function _MuralCanvas({
  mural,
  previewGeneration,
  isGridVisible = true,
  isSelecting = true,
  onSelect,
  ...passthrough
}: {
  mural: models.Mural;
  previewGeneration: models.Generation | null;
  isGridVisible?: boolean;
  isSelecting?: boolean;
  onSelect?: (rect: Rect) => void;
}) {
  const { ref, canvas } = useLayeredCanvas();

  const [previewImage, setPreviewImage] = useState<HTMLImageElement | null>(
    null,
  );
  useEffect(() => {
    if (previewGeneration) {
      urlToImage(previewGeneration.image).then(setPreviewImage);
    } else {
      setPreviewImage(null);
    }
  }, [previewGeneration]);

  const [selection, setSelection] = useState<Rect>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  function onMouseMove(e: MouseEvent<HTMLCanvasElement>) {
    if (!isSelecting) {
      return;
    }

    const size = models.Generation.SIZE;
    const { x, y } = getCanvasMouseCoordinates(canvas!.canvas, e);

    setSelection({
      x: x - size / 2,
      y: y - size / 2,
      width: size,
      height: size,
    });
  }

  const deepMuralDep = useDeepCompareMemoize(mural);
  const drawMainLayerRef = useCallbackRef(drawMainLayer, [deepMuralDep]);
  const drawGridLayerRef = useCallbackRef(drawGridLayer, [deepMuralDep]);
  const drawSelectionLayerRef = useCallbackRef(drawSelectionLayer, [
    selection,
    previewImage,
  ]);

  useEffect(() => {
    if (!canvas) {
      return;
    }

    canvas.addLayers(
      {
        id: CanvasLayer.Mural,
        draw: drawMainLayerRef,
      },
      {
        id: CanvasLayer.Grid,
        draw: drawGridLayerRef,
      },
      {
        id: CanvasLayer.Selection,
        draw: drawSelectionLayerRef,
      },
    );
  }, [canvas]);

  useEffect(() => {
    canvas?.setLayerVisibility(CanvasLayer.Grid, isGridVisible);
  }, [canvas, isGridVisible]);

  useEffect(() => {
    canvas?.setLayerVisibility(CanvasLayer.Selection, isSelecting);
  }, [canvas, isSelecting]);

  useEffect(() => {
    canvas?.draw().catch(console.error);
  }, [canvas, mural, selection]);

  return (
    <canvas
      ref={ref}
      width={mural.width}
      height={mural.height}
      onMouseMove={onMouseMove}
      {...passthrough}
    ></canvas>
  );

  async function drawMainLayer({ ctx }: CanvasWithContext) {
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

    async function drawEraseItem(item: models.Mural.EraseItem) {}
  }

  function drawGridLayer({ ctx }: CanvasWithContext) {
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
      thickness: 2,
      opacity: 0.7,
    });

    if (gridSubdivideRatio < 1) {
      strokePath({
        ctx,
        path: buildSubdividedPath(),
        thickness: 1,
        opacity: 0.2,
      });
    }

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

  async function drawSelectionLayer({ ctx }: CanvasWithContext) {
    const path = new Path2D();
    const { x, y, width, height } = selection;

    // console.log({ selection, previewGeneration });
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
}
