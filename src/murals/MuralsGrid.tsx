import { chakra, Grid } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { models } from '../store';
import { MuralTile } from './MuralTile';

export const MuralsGrid = chakra(observer(_MuralsGrid));

function _MuralsGrid({
  murals,
  onSelect,
  ...passthrough
}: {
  murals: models.Mural[];
  onSelect: (mural: models.Mural) => void;
}) {
  return (
    <Grid
      templateColumns={'repeat(3, minmax(0, 1fr))'}
      autoRows={'minmax(0, max-content)'}
      justifyItems={'stretch'}
      gap={'3rem'}
      {...passthrough}
    >
      {murals.map(mural => (
        <MuralTile
          key={mural.id}
          mural={mural}
          onSelect={() => onSelect(mural)}
        />
      ))}
    </Grid>
  );
}
