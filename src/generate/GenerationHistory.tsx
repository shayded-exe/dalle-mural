import { chakra, Grid, Skeleton } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { Except } from 'type-fest';

import { models } from '../store';
import { ImageDataUrl } from '../utils';
import { GenerationImage } from './GenerationImage';
import { Task, TaskProps } from './Task';

export interface GenerationHistoryProps extends Except<TaskProps, 'task'> {
  isLoading?: boolean;
  tasks: models.Task[];
  promptImage?: ImageDataUrl | null;
}

export const GenerationHistory = chakra(observer(_GenerationHistory));

function _GenerationHistory({
  isLoading,
  tasks,
  promptImage,
  selectedGeneration,
  select,
  deselect,
  ...passthrough
}: GenerationHistoryProps) {
  return (
    <Grid
      templateColumns='repeat(4, 1fr)'
      gridAutoRows='minmax(min-content, max-content)'
      justifyItems='stretch'
      gap='1rem'
      padding='0.5rem'
      scrollPadding='0.5rem'
      maxHeight='100%'
      overflowY='scroll'
      scrollSnapType='y proximity'
      {...passthrough}
    >
      {isLoading &&
        Array.from({ length: 4 }, (_, i) => (
          <Skeleton
            key={i}
            borderRadius='4px'
          >
            <GenerationImage image={null} />
          </Skeleton>
        ))}

      {tasks.map(task => (
        <Task
          key={task.id}
          task={task}
          selectedGeneration={selectedGeneration}
          select={select}
          deselect={deselect}
        />
      ))}
    </Grid>
  );
}
