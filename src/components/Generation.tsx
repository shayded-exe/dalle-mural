import { chakra, Image } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import React, { ReactNode } from 'react';

import { Generation as StoreGeneration } from '../store';

interface Props {
  generation: StoreGeneration;

  className?: string;
  children?: ReactNode;
}

const _Generation = ({ generation, className, children }: Props) => {
  return (
    <div
      className={className}
      style={{ position: 'relative' }}
    >
      <Image src={generation.image} />
      {children && (
        <div
          className='generation-hover-contents'
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const Generation = chakra(observer(_Generation), {
  baseStyle: {
    maxWidth: '1024px',
    maxHeight: '1024px',
  },
});
