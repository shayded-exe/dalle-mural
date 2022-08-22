import { chakra, Flex, IconButton, Input, Spinner } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { CgClose } from 'react-icons/cg';

import { CgIcon } from '../components/CgIcon';
import { useStores } from '../store';
import { GeneratePanelContainer } from './GeneratePanelContainer';
import { GenerationHistory } from './GenerationHistory';

export const GeneratePanel = chakra(observer(_GeneratePanel));

function _GeneratePanel({ ...passthrough }: {}) {
  const {
    dalleStore: { dalle, generationTasks, addTask },
    uiStore: { selectedGeneration, selectGeneration, deselectGeneration, closePanel },
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
          icon={<CgIcon as={CgClose} />}
          aria-label='close'
        />
      </Flex>

      {isGenerating ? (
        <Spinner size={'xl'} />
      ) : (
        <GenerationHistory
          tasks={generationTasks}
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

    await getTask()
      .then(addTask)
      .catch(console.error)
      .finally(() => setIsGenerating(false));

    async function getTask() {
      if (prompt.startsWith('task-')) {
        return await dalle.getSuccessfulTask(prompt);
      } else {
        return await dalle.generate({ prompt });
      }
    }
  }
}
