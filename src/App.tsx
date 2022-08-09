import './App.css';

import { Button, chakra, Flex, Input } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { FormEvent, useState } from 'react';

import { Mural, ResultGenerations } from './components';
import { SuccessfulDalleTask } from './dalle';
import { useStores } from './store';

export const App = observer(() => {
  const {
    dalle,
    dalleStore,
    muralStore,
    taskStore,
    clear: clearStore,
  } = useStores();

  const [prompt, setPrompt] = useState('');
  const [taskId, setTaskId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const loadTask = async (e: FormEvent) => {
    e.preventDefault();

    setIsGenerating(true);
    const task = await dalle.getTask(`task-${taskId}`);
    setIsGenerating(false);

    try {
      await taskStore.loadResult(task);
    } catch (e) {
      console.error(e);
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

  return (
    <Flex
      direction='row'
      align='stretch'
      className='app'
    >
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
          <Button onClick={() => clearStore()}>Clear store</Button>

          <Input
            placeholder='Auth token'
            value={dalleStore.authToken}
            onChange={e => dalleStore.setAuthToken(e.target.value)}
          />

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

      <Mural
        mural={muralStore.activeMural}
        flexGrow='1'
      />
    </Flex>
  );
});
