import { chakra, Grid } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { models } from '../store';
import { Generation } from './Generation';

function _GenerationHistory({
  generations,
  selectedId,
  select,
  deselect,
  ...passthrough
}: {
  generations: models.Generation[][];
  selectedId: string | null;
  select: (id: string) => void;
  deselect: () => void;
}) {
  return (
    <Grid
      templateColumns={'repeat(4, 1fr)'}
      justifyItems={'center'}
      gap={'1rem'}
      padding={'0.5rem'}
      maxHeight={'24rem'}
      overflowY={'scroll'}
      {...passthrough}
    >
      {generations.flat().map(generation => (
        <Generation
          key={generation.id}
          generation={generation}
          isSelected={generation.id === selectedId}
          onSelect={() => select(generation.id)}
          onDeselect={deselect}
          cursor={'pointer'}
        />
      ))}
    </Grid>
  );
}

export const GenerationHistory = chakra(observer(_GenerationHistory));
