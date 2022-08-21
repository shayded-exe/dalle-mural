import { chakra, Grid } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { models } from '../store';
import { ImageDataUrl } from '../utils';
import { Generation } from './Generation';
import { GenerationImage } from './GenerationImage';

export const GenerationHistory = chakra(observer(_GenerationHistory));

function _GenerationHistory({
  tasks,
  isInpaintingMode = false,
  promptImage,
  selectedGeneration,
  select,
  deselect,
  ...passthrough
}: {
  tasks: models.Task[];
  isInpaintingMode?: boolean;
  promptImage?: ImageDataUrl | null;
  selectedGeneration: models.Generation | null;
  select: (generation: models.Generation) => void;
  deselect: () => void;
}) {
  return (
    <Grid
      templateColumns={'repeat(4, 1fr)'}
      justifyItems={'stretch'}
      gap={'1rem'}
      padding={'0.5rem'}
      scrollPadding={'0.5rem'}
      maxHeight={'100%'}
      overflowY={'scroll'}
      scrollSnapType={'y mandatory'}
      {...passthrough}
    >
      {tasks.map((task, i) => (
        <Task
          key={task.id}
          task={task}
          isFirst={i === 0}
        />
      ))}
    </Grid>
  );

  function Task({ task, isFirst }: { task: models.Task; isFirst: boolean }) {
    return (
      <>
        {isInpaintingMode && (
          <GenerationImage
            key={task.id}
            image={isFirst ? promptImage : task.promptImage}
            transparentBg={true}
          />
        )}

        {task.generations.map(generation => (
          <Generation
            key={generation.id}
            generation={generation}
            isSelected={generation.id === selectedGeneration?.id}
            onSelect={() => select(generation)}
            onDeselect={deselect}
            cursor={'pointer'}
            scrollSnapAlign={'center'}
          />
        ))}
      </>
    );
  }
}
