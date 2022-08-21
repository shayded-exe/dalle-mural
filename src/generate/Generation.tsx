import { chakra } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { ReactNode, useCallback } from 'react';

import { models } from '../store';
import { GenerationImage } from './GenerationImage';

export const Generation = chakra(observer(_Generation));

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
    <GenerationImage
      image={generation.image}
      onClick={onClick}
      boxShadow={isSelected ? 'outline' : undefined}
      borderRadius={2}
      {...passthrough}
    />
  );
}
