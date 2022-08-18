import { useCallback, useState } from 'react';

import { getContextOrFail } from './utils';

export function useCanvas() {
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

  const ref = useCallback((canvasEl: HTMLCanvasElement | null) => {
    if (canvasEl) {
      setCanvas(canvasEl);
      setCtx(getContextOrFail(canvasEl));
    }
  }, []);

  return { ref, canvas, ctx };
}
