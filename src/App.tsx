import './App.css';

import { chakra, Flex, Input, Spinner, useConst } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { FormEvent, useEffect, useState } from 'react';

import { Canvas, Generation } from './components';
import { Dalle, SuccessfulTask } from './dalle';
import { useStore } from './store';

export const App = observer(() => {
  const store = useStore();
  const dalle = useConst(() => new Dalle(store.authToken));

  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    dalle.authToken = store.authToken;
  }, [store.authToken]);

  const generate = async (e: FormEvent) => {
    e.preventDefault();

    setIsGenerating(true);
    let task;

    try {
      task = (await dalle.generate({ prompt })) as SuccessfulTask;
    } catch (e) {
      console.error(e);
      return;
    } finally {
      setIsGenerating(false);
    }

    store.addTask(task);
    store.loadResults(task.generations.data);
  };

  return (
    <Flex
      direction='column'
      align='stretch'
      className='app'
    >
      <Canvas flexGrow='1' />

      <Flex
        flex='0 0 20rem'
        direction='column'
        padding='4'
        boxShadow='md-up'
      >
        <Flex
          flexShrink='0'
          direction='row'
          gap='4'
        >
          <Input
            placeholder='Auth token'
            value={store.authToken}
            onChange={e => store.setAuthToken(e.target.value)}
            flex='0 0 20rem'
          />

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
          direction='row'
          justify='center'
          align='center'
          gap='4'
          grow='1'
          marginTop='4'
          paddingX='16'
        >
          {isGenerating ? (
            <Spinner size='xl' />
          ) : (
            store.resultGenerations.map(generation => (
              <Generation
                key={generation.id}
                generation={generation}
              />
            ))
          )}
        </Flex>
      </Flex>
    </Flex>
  );
});
