import { Buffer } from 'buffer';
import ky from 'ky';

import { canvasToImage, createCanvas } from '../canvas';
import { ImageBase64, ImageDataUrl } from './primitives';

export async function urlToImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = e => reject(e);

    img.src = url;
  });
}

export async function urlToImageDataUrl_fetch(url: string): Promise<ImageDataUrl> {
  return ky
    .get(url)
    .arrayBuffer()
    .then(buffer => Buffer.from(buffer).toString('base64'))
    .then(base64 => `data:image/png;base64,${base64}` as ImageDataUrl);
}

async function urlToImageDataUrl_canvas(url: string): Promise<ImageDataUrl> {
  const img = await urlToImage(url);
  const { canvas, ctx } = createCanvas({
    width: img.naturalWidth,
    height: img.naturalHeight,
  });

  ctx.drawImage(img, 0, 0);

  return canvasToImage(canvas);
}

export async function openImage(src: string) {
  const img = await urlToImage(src);

  const win = window.open('');
  win?.document.write(img.outerHTML);
}

export function downloadImage(src: string, filename?: string) {
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = src;
  link.download = filename ?? `${Date.now()}.png`;
  link.click();
}

export function imageDataUrlToBase64(dataUrl: ImageDataUrl): ImageBase64 {
  return dataUrl.split(',')[1] as ImageBase64;
}
