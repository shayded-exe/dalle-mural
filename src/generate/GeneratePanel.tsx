import { CloseIcon } from '@chakra-ui/icons';
import { chakra, Flex, IconButton, Input, Spinner } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';

import { GenerationHistory } from '../components/GenerationHistory';
import { SuccessfulDalleTask } from '../dalle';
import { useStores } from '../store';
import { GeneratePanelContainer } from './GeneratePanelContainer';

export const GeneratePanel = chakra(observer(_GeneratePanel));

function _GeneratePanel({ ...passthrough }: {}) {
  const {
    dalle,
    uiStore: { selectedGeneration, selectGeneration, deselectGeneration, closePanel },
    generateStore: { generationHistory, addFromTask },
  } = useStores();

  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <GeneratePanelContainer {...passthrough}>
      <Flex gap={'1rem'}>
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

        <IconButton
          onClick={closePanel}
          icon={<CloseIcon />}
          aria-label='Close panel'
        />
      </Flex>

      {isGenerating ? (
        <Spinner size={'xl'} />
      ) : (
        <GenerationHistory
          generations={generationHistory}
          selectedGeneration={selectedGeneration}
          select={selectGeneration}
          deselect={deselectGeneration}
          maxHeight={'20rem'}
        />
      )}
    </GeneratePanelContainer>
  );

  async function generate(e: React.FormEvent) {
    e.preventDefault();

    setIsGenerating(true);

    try {
      const task = (await getTask()) as SuccessfulDalleTask;
      await addFromTask(task);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }

    async function getTask() {
      if (prompt.startsWith('task-')) {
        return await dalle.getTask(prompt);
      } else {
        return await dalle.generate({ prompt });
      }
    }
  }
}
