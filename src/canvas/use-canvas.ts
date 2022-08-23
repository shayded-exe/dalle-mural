import { DependencyList, EffectCallback, useEffect, useState } from 'react';

import { useOnInitRef } from '../utils';
import { getContextOrFail } from './utils';

export function useCanvas() {
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

  const ref = useOnInitRef<HTMLCanvasElement>(canvasEl => {
    setCanvas(canvasEl);
    setCtx(getContextOrFail(canvasEl));
  });

  return { ref, canvas, ctx };
}

export function useCanvasDraw(
  draw: (ctx: CanvasRenderingContext2D) => ReturnType<EffectCallback>,
  deps: DependencyList,
) {
  const { ctx, ...rest } = useCanvas();

  useEffect(() => {
    if (ctx) {
      draw(ctx);
    }
  }, [ctx, ...deps]);

  return { ctx, ...rest };
}
