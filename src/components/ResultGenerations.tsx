import { chakra, Flex, Spinner } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { useStores } from '../store';
import { Generation } from './Generation';

const _ResultGenerations = ({
  isGenerating,
  ...passthrough
}: {
  isGenerating: boolean;
}) => {
  const { generationStore, muralStore } = useStores();

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
            isSelected={generation.id === generationStore.selectedResultId}
            onSelect={() => generationStore.selectResult(generation.id)}
            cursor='pointer'
          />
        ))
      )}
    </Flex>
  );
};

export const ResultGenerations = chakra(observer(_ResultGenerations));
