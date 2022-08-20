import { chakra, Flex, Grid } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { models } from '../store';
import { ImageDataUrl } from '../utils';
import { Generation } from './Generation';
import { GenerationImage } from './GenerationImage';

export const GenerationHistory = chakra(observer(_GenerationHistory));

function _GenerationHistory({
  generations,
  showPromptImage = false,
  promptImage,
  selectedGeneration,
  select,
  deselect,
  ...passthrough
}: {
  generations: models.Generation[][];
  showPromptImage?: boolean;
  promptImage?: ImageDataUrl | null;
  selectedGeneration: models.Generation | null;
  select: (generation: models.Generation) => void;
  deselect: () => void;
}) {
  const columns = showPromptImage ? 3 : 4;

  return (
    <Flex
      direction={'row'}
      align={'start'}
      {...passthrough}
    >
      {showPromptImage && (
        <GenerationImage
          image={promptImage}
          transparentBg={true}
          margin={'0.5rem'}
          width={`${models.Generation.SIZE}px`}
          height={`${models.Generation.SIZE}px`}
        />
      )}

      <Grid
        templateColumns={`repeat(${columns}, 1fr)`}
        justifyItems={'center'}
        gap={'1rem'}
        padding={'0.5rem'}
        scrollPadding={'0.5rem'}
        maxHeight={'100%'}
        overflowY={'scroll'}
        scrollSnapType={'y mandatory'}
      >
        {generations.flat().map(generation => (
          <Generation
            key={generation.id}
            generation={generation}
            isSelected={generation.id === selectedGeneration?.id}
            onSelect={() => select(generation)}
            onDeselect={deselect}
            cursor={'pointer'}
            scrollSnapAlign={'start'}
          />
        ))}
      </Grid>
    </Flex>
  );
}
