import { chakra, Image } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { GenerationMeta } from '../dalle';

interface Props {
  generation: GenerationMeta;

  className?: string;
}

const _Generation = ({ generation, className }: Props) => {
  const {
    generation: { image_path },
  } = generation;

  return (
    <Image
      src={image_path}
      className={className}
    />
  );
};

export const Generation = chakra(observer(_Generation), {
  baseStyle: {
    minWidth: '0',
    minHeight: '0',
    maxWidth: '1024px',
    maxHeight: '1024px',
  },
});
