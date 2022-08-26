import { Box, chakra, Image } from '@chakra-ui/react';
import React from 'react';

import { models } from '../store';
import { ImageDataUrl } from '../utils';

const { DISPLAY_SIZE, MIN_DISPLAY_SIZE } = models.Generation;

export const GenerationImage = chakra(_GenerationImage, {
  baseStyle: {
    maxWidth: DISPLAY_SIZE,
    maxHeight: DISPLAY_SIZE,
    minWidth: MIN_DISPLAY_SIZE,
    minHeight: MIN_DISPLAY_SIZE,
  },
});

function _GenerationImage({
  image,
  transparentBg = true,
  ...passthrough
}: {
  image: ImageDataUrl | null | undefined;
  transparentBg?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}) {
  const borderRadius = 'base';

  return (
    <Box
      background={transparentBg ? 'transparent-bg' : undefined}
      borderRadius={borderRadius}
      {...passthrough}
    >
      {image ? (
        <Image
          src={image}
          decoding='async'
          loading='lazy'
          borderRadius={borderRadius}
        />
      ) : (
        <Box
          width={'100%'}
          height={'100%'}
        />
      )}
    </Box>
  );
}
