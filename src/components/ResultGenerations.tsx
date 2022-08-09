import { Button, chakra, Flex, Spinner } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { models, useStores } from '../store';
import { Generation } from './Generation';

interface Props {
  isGenerating: boolean;
}

const _ResultGenerations = ({ isGenerating, ...passthrough }: Props) => {
  const { generationStore, muralStore } = useStores();

  const placeGeneration = (generation: models.Generation) => {
    muralStore.place({
      generationId: generation.id,
      x: 0,
      y: 0,
    });
  };

  return (
    <Flex
      direction='column'
      justify='center'
      align='center'
      gap='4'
      {...passthrough}
    >
      {isGenerating ? (
        <Spinner size='xl' />
      ) : (
        generationStore.resultGenerations.map(generation => (
          <Generation
            key={generation.id}
            generation={generation}
          >
            <Button onClick={() => placeGeneration(generation)}>Add</Button>
          </Generation>
        ))
      )}
    </Flex>
  );
};

export const ResultGenerations = chakra(observer(_ResultGenerations));
