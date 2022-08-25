import { DalleTaskType } from '../dalle';
import { models } from '../store';
import { Generation } from './Generation';
import { GenerationImage } from './GenerationImage';

export interface TaskProps {
  task: models.Task;
  selectedGeneration: models.Generation | null;
  select: (generation: models.Generation) => void;
  deselect: () => void;
}

export function Task({ task, selectedGeneration, select, deselect }: TaskProps) {
  return (
    <>
      {task.type === DalleTaskType.Inpainting && (
        <GenerationImage
          key={task.id}
          image={task.promptImage}
        />
      )}

      {task.generations.map(generation => (
        <Generation
          key={generation.id}
          generation={generation}
          isSelected={generation.id === selectedGeneration?.id}
          onSelect={() => select(generation)}
          onDeselect={deselect}
          cursor='pointer'
          scrollSnapAlign='start'
        />
      ))}
    </>
  );
}
