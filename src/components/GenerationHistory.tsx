import { chakra, Grid } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { models } from '../store';
import { Generation } from './Generation';

function _GenerationHistory({
  generations,
  selectedGeneration,
  select,
  deselect,
  ...passthrough
}: {
  generations: models.Generation[][];
  selectedGeneration: models.Generation | null;
  select: (generation: models.Generation) => void;
  deselect: () => void;
}) {
  return (
    <Grid
      templateColumns={'repeat(4, 1fr)'}
      justifyItems={'center'}
      gap={'1rem'}
      padding={'0.5rem'}
      overflowY={'scroll'}
      {...passthrough}
    >
      {generations.flat().map(generation => (
        <Generation
          key={generation.id}
          generation={generation}
          isSelected={generation.id === selectedGeneration?.id}
          onSelect={() => select(generation)}
          onDeselect={deselect}
          cursor={'pointer'}
        />
      ))}
    </Grid>
  );
}

export const GenerationHistory = chakra(observer(_GenerationHistory));
