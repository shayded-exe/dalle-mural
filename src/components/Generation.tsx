import { chakra, Image } from '@chakra-ui/react';
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
    <Image
      src={generation.image}
      onClick={onClick}
      boxShadow={isSelected ? 'outline' : undefined}
      borderRadius={2}
      height='100%'
      {...passthrough}
    />
  );
}
