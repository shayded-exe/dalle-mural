import { Box, Center, chakra, Image } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { ReactNode, useCallback } from 'react';

import { models } from '../store';

const pixelSize = `${models.Generation.DISPLAY_SIZE}px`;
const minPixelSize = `${models.Generation.DISPLAY_SIZE / 2}px`;

export const Generation = chakra(observer(_Generation), {
  baseStyle: {
    maxWidth: pixelSize,
    maxHeight: pixelSize,
    minWidth: minPixelSize,
    minHeight: minPixelSize,
  },
});

function _Generation({
  generation,
  isSelected = false,
  onSelect,
  onDeselect,
  children,
  ...passthrough
}: {
  generation: models.Generation;
  isSelected?: boolean;

  onSelect?: () => void;
  onDeselect?: () => void;

  children?: ReactNode;
}) {
  const onClick = useCallback(() => {
    if (isSelected) {
      onDeselect?.();
    } else {
      onSelect?.();
    }
  }, [onSelect, onDeselect]);

  return (
    <Box
      role='group'
      position={'relative'}
      boxShadow={isSelected ? 'outline' : undefined}
      borderRadius={2}
      onClick={onClick}
      {...passthrough}
    >
      <Image
        src={generation.image}
        height='100%'
      />
      {children && (
        <Center
          position={'absolute'}
          top={0}
          right={0}
          bottom={0}
          left={0}
          opacity={0}
          zIndex={'mural-overlay'}
          _groupHover={{ opacity: 1 }}
        >
          {children}
        </Center>
      )}
    </Box>
  );
}
