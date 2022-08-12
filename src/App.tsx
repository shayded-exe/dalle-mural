import { Center, chakra, Flex, Input, Spinner } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { FormEvent, useState } from 'react';

import { Mural, ResultGenerations } from './components';
import { GenerateToolbar } from './components/GenerateToolbar';
import { SettingsToolbar } from './components/SettingsToolbar';
import { SuccessfulDalleTask } from './dalle';
import { useStores } from './store';

export const App = observer(() => {
  const { dalle, muralStore, taskStore, isHydrated } = useStores();

  const [prompt, setPrompt] = useState('');
  const [taskId, setTaskId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const loadTask = async (e: FormEvent) => {
    e.preventDefault();

    setIsGenerating(true);
    const task = await dalle.getTask(`task-${taskId}`);

    try {
      await taskStore.loadResult(task);
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

    await taskStore.loadResult(task);
  };

  if (!isHydrated) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  const oldToolbar = (
    <Flex
      flex='0 0 20rem'
      direction='column'
      padding='4'
      boxShadow='md'
    >
      <Flex
        flexShrink='0'
        direction='column'
        gap='4'
      >
        <chakra.form
          onSubmit={loadTask}
          flexGrow='1'
        >
          <Input
            placeholder='Task id'
            value={taskId}
            onChange={e => setTaskId(e.target.value)}
          />
        </chakra.form>

        <chakra.form
          onSubmit={generate}
          flexGrow='1'
        >
          <Input
            placeholder='Use your imagination 🌈'
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
          />
        </chakra.form>
      </Flex>

      <ResultGenerations
        isGenerating={isGenerating}
        minHeight='0'
        marginTop='4'
        paddingX='1'
      />
    </Flex>
  );

  return (
    <Flex
      direction='column'
      align='center'
      justify='space-between'
      position='relative'
      width='100vw'
      height='100vh'
    >
      <SettingsToolbar
        margin='2rem'
        width='calc(100% - 4rem)'
        maxWidth='80rem'
        minWidth='0'
        zIndex='docked'
      />

      <GenerateToolbar
        marginX='2rem'
        marginBottom='5%'
        zIndex='docked'
      />

      <Mural
        mural={muralStore.activeMural}
        position='absolute'
      />
    </Flex>
  );
});
