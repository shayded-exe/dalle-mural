import { Buffer } from 'buffer';
import ky from 'ky';

export async function loadImageUrlToBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = function () {
      const canvas = document.createElement('canvas');

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(image, 0, 0);

      resolve(canvas.toDataURL());
    };

    try {
      image.src = url;
    } catch (e) {
      reject(e);
    }
  });
}

export async function loadImageUrlToBase64_fetch(url: string): Promise<string> {
  return ky
    .get(url)
    .arrayBuffer()
    .then(buffer => Buffer.from(buffer).toString('base64'))
    .then(base64 => `data:image/png;base64,${base64}`);
}
