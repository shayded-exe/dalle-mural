import { Box, chakra, Image } from '@chakra-ui/react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { CSSProperties, ReactNode } from 'react';

import { models } from '../store';

interface Props {
  generation: models.Generation;

  className?: string;
  children?: ReactNode;
}

const hoverContentsStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  opacity: 0,
};

const _Generation = ({ generation, className, children }: Props) => {
  return (
    <Box
      role='group'
      pos='relative'
      className={classNames('generation', className)}
    >
      <Image
        src={generation.image}
        height='100%'
      />
      {children && (
        <Box
          sx={hoverContentsStyle}
          _groupHover={{ opacity: 1 }}
        >
          {children}
        </Box>
      )}
    </Box>
  );
};

const pixelSize = `${models.Generation.SIZE}px`;

export const Generation = chakra(observer(_Generation), {
  baseStyle: {
    minWidth: 0,
    minHeight: 0,
    maxWidth: pixelSize,
    maxHeight: pixelSize,
  },
});
