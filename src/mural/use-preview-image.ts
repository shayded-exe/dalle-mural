import { useEffect, useState } from 'react';

import { models } from '../store';
import { urlToImage } from '../utils';

export function usePreviewImage(generation: models.Generation | null) {
  const [previewImage, setPreviewImage] = useState<HTMLImageElement | null>(null);

  useEffect(
    function updatePreviewImage() {
      if (generation) {
        urlToImage(generation.image).then(setPreviewImage);
      } else {
        setPreviewImage(null);
      }
    },
    [generation],
  );

  return { previewImage };
}
