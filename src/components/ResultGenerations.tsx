import { chakra, Grid } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { useStores } from '../store';
import { Generation } from './Generation';

const _ResultGenerations = ({ ...passthrough }: {}) => {
  const {
    generationStore: { resultGenerations },
    uiStore: { selectedResultId, selectResult, deselectResult },
  } = useStores();

  return (
    <Grid
      templateColumns={'repeat(2, 1fr)'}
      gap={4}
      {...passthrough}
    >
      {resultGenerations.map(generation => (
        <Generation
          key={generation.id}
          generation={generation}
          isSelected={generation.id === selectedResultId}
          onSelect={() => selectResult(generation.id)}
          onDeselect={deselectResult}
          cursor={'pointer'}
        />
      ))}
    </Grid>
  );
};

export const ResultGenerations = chakra(observer(_ResultGenerations));
