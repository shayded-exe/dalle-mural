import { ArrowLeftIcon } from '@chakra-ui/icons';
import {
  chakra,
  Flex,
  Heading,
  IconButton,
  Input,
  Spinner,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { FormEvent, useState } from 'react';

import { SuccessfulDalleTask } from '../dalle';
import { useStores } from '../store';
import { ResultGenerations } from './ResultGenerations';

export const GeneratePanel = chakra(observer(_GeneratePanel));

function _GeneratePanel({ ...passthrough }: {}) {
  const {
    dalle,
    uiStore: { closePanel },
    taskStore: { loadResult },
  } = useStores();

  const [prompt, setPrompt] = useState('');
  const [taskId, setTaskId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const loadTask = async (e: FormEvent) => {
    e.preventDefault();

    setIsGenerating(true);
    const task = await dalle.getTask(`task-${taskId}`);

    try {
      await loadResult(task);
    } catch (e) {
      console.error(e);
      return;
    } finally {
      setIsGenerating(false);
    }
  };

  const generate = async (e: FormEvent) => {
    e.preventDefault();

    setIsGenerating(true);
    let task;

    try {
      task = (await dalle.generate({ prompt })) as SuccessfulDalleTask;
    } catch (e) {
      console.error(e);
      return;
    } finally {
      setIsGenerating(false);
    }

    await loadResult(task);
  };

  return (
    <Flex
      padding={4}
      minHeight={0}
      background={'white'}
      boxShadow={'window-right'}
      borderRightRadius={'lg'}
      direction={'column'}
      gap={4}
      {...passthrough}
    >
      <Flex justify={'space-between'}>
        <Heading size={'lg'}>Generate</Heading>
        <IconButton
          onClick={closePanel}
          icon={<ArrowLeftIcon />}
          aria-label='Close panel'
          alignSelf={'end'}
        />
      </Flex>
      <Flex
        flexShrink={0}
        direction={'column'}
        gap={4}
      >
        <chakra.form
          onSubmit={loadTask}
          flexGrow={1}
        >
          <Input
            placeholder='Task id'
            value={taskId}
            onChange={e => setTaskId(e.target.value)}
          />
        </chakra.form>

        <chakra.form
          onSubmit={generate}
          flexGrow={1}
        >
          <Input
            placeholder='Use your imagination 🌈'
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
          />
        </chakra.form>
      </Flex>

      {isGenerating ? (
        <Spinner size={'xl'} />
      ) : (
        <ResultGenerations minHeight={0} />
      )}
    </Flex>
  );
}
