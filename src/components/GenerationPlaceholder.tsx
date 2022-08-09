import { AddIcon } from '@chakra-ui/icons';
import { chakra, IconButton } from '@chakra-ui/react';

import { models } from '../store';

const _GenerationPlaceholder = ({
  onAdd,
  ...passthrough
}: {
  onAdd: () => void;
}) => {
  return (
    <IconButton
      onClick={onAdd}
      icon={<AddIcon />}
      aria-label='Add mural'
      {...passthrough}
    />
  );
};

const pixelSize = `${models.Generation.BASE_DISPLAY_SIZE}px`;

export const GenerationPlaceholder = chakra(_GenerationPlaceholder, {
  baseStyle: {
    width: pixelSize,
    height: pixelSize,
  },
});
