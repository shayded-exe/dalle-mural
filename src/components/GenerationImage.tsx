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
  transparentBg = false,
  ...passthrough
}: {
  image?: ImageDataUrl | null;
  transparentBg?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <Box
      background={transparentBg ? 'transparent-bg' : undefined}
      {...passthrough}
    >
      {image ? (
        <Image src={image} />
      ) : (
        <Box
          width={DISPLAY_SIZE}
          height={DISPLAY_SIZE}
        />
      )}
    </Box>
  );
}
