import { max, sortBy } from 'lodash';
import { RefObject, useCallback, useState } from 'react';
import * as uuid from 'uuid';

import { Dimensions } from '../utils';
import {
  CanvasWithContext,
  clearCanvas,
  createCanvas,
  getContextOrFail,
} from './utils';

export namespace LayeredCanvas {
  export type DrawFunc = (context: CanvasWithContext) => void | Promise<void>;

  export interface NewLayer {
    id?: string;
    order?: number;
    isVisible?: boolean;
    draw?: DrawFunc;
    drawRef?: RefObject<DrawFunc>;
  }

  export interface Layer extends CanvasWithContext {
    order: number;
    isVisible: boolean;
    draw: DrawFunc;
  }
}

export class LayeredCanvas {
  readonly canvas: HTMLCanvasElement;

  readonly #ctx: CanvasRenderingContext2D;
  readonly #layers = new Map<string, LayeredCanvas.Layer>();

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.#ctx = getContextOrFail(canvas);
  }

  get dimensions(): Dimensions {
    return {
      width: this.width,
      height: this.height,
    };
  }

  get width(): number {
    return this.canvas.width;
  }

  set width(value: number) {
    throw new Error('Not implemented');
  }

  get height(): number {
    return this.canvas.height;
  }

  set height(value: number) {
    throw new Error('Not implemented');
  }

  get #layerArray(): LayeredCanvas.Layer[] {
    return Array.from(this.#layers.values());
  }

  get #sortedLayers(): LayeredCanvas.Layer[] {
    return sortBy(this.#layerArray, l => l.order);
  }

  getLayer(id: string): LayeredCanvas.Layer | undefined {
    return this.#layers.get(id);
  }

  getLayerOrFail(id: string): LayeredCanvas.Layer {
    const layer = this.getLayer(id);
    if (!layer) {
      throw new Error(`Layer ${id} doesn't exist`);
    }
    return layer;
  }

  addLayer(newLayer: LayeredCanvas.NewLayer) {
    const newId = newLayer.id ?? uuid.v4();

    if (this.getLayer(newId)) {
      throw new Error(`Layer ${newId} already exists`);
    }

    this.#layers.set(newId, {
      order: newLayer.order ?? this.#getMaxOrder() + 1,
      isVisible: newLayer.isVisible ?? true,
      draw: ctx => {
        const _draw = newLayer.drawRef?.current ?? newLayer.draw!;
        return _draw(ctx);
      },
      ...createCanvas(this.dimensions),
    });
  }

  addLayers(...newLayers: LayeredCanvas.NewLayer[]) {
    newLayers.forEach(l => this.addLayer(l));
  }

  removeLayer(id: string): boolean {
    return this.#layers.delete(id);
  }

  setLayerVisibility(id: string, isVisible: boolean) {
    const layer = this.getLayerOrFail(id);
    layer.isVisible = isVisible;
    this.draw();
  }

  clear() {
    clearCanvas(this.#ctx);
  }

  async draw() {
    this.clear();

    for (const layer of this.#sortedLayers) {
      clearCanvas(layer.ctx);
      await layer.draw(layer);
      this.#ctx.drawImage(layer.canvas, 0, 0);
    }
  }

  #getMaxOrder(): number {
    const orders = this.#layerArray.map(l => l.order);

    return max(orders) ?? 0;
  }
}

export function useLayeredCanvas() {
  const [canvas, setLayeredCanvas] = useState<LayeredCanvas | null>(null);

  const ref = useCallback((canvas: HTMLCanvasElement | null) => {
    if (!canvas) {
      return;
    }

    setLayeredCanvas(new LayeredCanvas(canvas));
  }, []);

  return { ref, canvas };
}
