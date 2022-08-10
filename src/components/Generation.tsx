import { Box, Center, chakra, Image } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { CSSProperties, ReactNode } from 'react';

import { models } from '../store';

const hoverContentsStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  opacity: 0,
};

const _Generation = ({
  generation,
  isSelected = false,
  onSelect,
  className,
  children,
  ...passthrough
}: {
  generation: models.Generation;
  isSelected?: boolean;

  onSelect?: () => void;
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <Box
      role='group'
      pos='relative'
      className={className}
      sx={{
        boxShadow: !isSelected
          ? undefined
          : '0px 0px 0px 4px var(--chakra-colors-blue-500)',
        borderRadius: 2,
      }}
      onClick={onSelect}
      {...passthrough}
    >
      <Image
        src={generation.image}
        height='100%'
      />
      {children && (
        <Center
          zIndex='mural-overlay'
          sx={hoverContentsStyle}
          _groupHover={{ opacity: 1 }}
        >
          {children}
        </Center>
      )}
    </Box>
  );
};

const pixelSize = `${models.Generation.BASE_DISPLAY_SIZE}px`;

export const Generation = chakra(observer(_Generation), {
  baseStyle: {
    minWidth: 0,
    minHeight: 0,
    maxWidth: pixelSize,
    maxHeight: pixelSize,
  },
});
