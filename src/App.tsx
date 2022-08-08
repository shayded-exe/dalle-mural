import './App.css';

import { Button, chakra, Flex, Input, Spinner } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { FormEvent, useState } from 'react';

import { Generation, Mural } from './components';
import { SuccessfulDalleTask } from './dalle';
import { Generation as StoreGeneration, useStores } from './store';

export const App = observer(() => {
  const {
    dalle,
    dalleStore,
    mural,
    taskStore,
    generationStore,
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

  const placeGeneration = (generation: StoreGeneration) => {
    mural.place({
      generationId: generation.id,
      x: 0,
      y: 0,
    });
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

        <Flex
          direction='column'
          justify='center'
          align='center'
          gap='4'
          grow='1'
          marginTop='4'
          paddingX='1'
        >
          {isGenerating ? (
            <Spinner size='xl' />
          ) : (
            generationStore.resultGenerations.map(generation => (
              <Generation
                key={generation.id}
                generation={generation}
                className='addable-generation'
              >
                <Button onClick={() => placeGeneration(generation)}>Add</Button>
              </Generation>
            ))
          )}
        </Flex>
      </Flex>

      <Mural flexGrow='1' />
    </Flex>
  );
});
