import { Buffer } from 'buffer';
import ky from 'ky';
import { Opaque } from 'type-fest';

import { createCanvas } from './canvas';

export type ImageDataUrl = Opaque<string, 'DataUrl'>;

export async function urlToImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = e => reject(e);

    img.src = url;
  });
}

export async function urlToImageDataUrl_fetch(
  url: string,
): Promise<ImageDataUrl> {
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

  return canvas.toDataURL() as ImageDataUrl;
}

export function openImage(src: string) {
  const img = new Image();
  img.src = src;

  const w = window.open('');
  w?.document.write(img.outerHTML);
}

export function downloadImage(src: string, filename?: string) {
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = src;
  link.download = filename ?? `${Date.now()}.png`;

  document.body.appendChild(link);

  try {
    link.click();
  } catch (e) {
    console.error(e);
  } finally {
    document.body.removeChild(link);
  }
}
