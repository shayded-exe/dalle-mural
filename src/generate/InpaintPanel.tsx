import { chakra, Flex, IconButton, Input, Spinner } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { CgClose } from 'react-icons/cg';

import { CgIcon } from '../components/CgIcon';
import { useStores } from '../store';
import { GeneratePanelContainer } from './GeneratePanelContainer';
import { GenerationHistory } from './GenerationHistory';

export const InpaintPanel = chakra(observer(_InpaintPanel));

function _InpaintPanel({ ...passthrough }: {}) {
  const {
    dalleStore: { dalle, inpaintingTasks, addTask },
    uiStore: {
      selectionAreaImage,
      selectedGeneration,
      selectGeneration,
      deselectGeneration,
      closePanel,
    },
  } = useStores();

  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <GeneratePanelContainer {...passthrough}>
      <Flex gap={'1rem'}>
        <chakra.form
          onSubmit={inpaint}
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
          tasks={inpaintingTasks}
          promptImage={selectionAreaImage}
          isInpaintingMode={true}
          selectedGeneration={selectedGeneration}
          select={selectGeneration}
          deselect={deselectGeneration}
          maxHeight={'20rem'}
        />
      )}
    </GeneratePanelContainer>
  );

  async function inpaint(e: React.FormEvent) {
    e.preventDefault();

    const isTaskId = prompt.startsWith('task-');

    if (!isTaskId && !selectionAreaImage) {
      return;
    }

    setIsGenerating(true);

    await getTask()
      .then(addTask)
      .catch(console.error)
      .finally(() => setIsGenerating(false));

    async function getTask() {
      if (isTaskId) {
        return await dalle.getSuccessfulTask(prompt);
      } else {
        return await dalle.generateInpainting({
          prompt,
          maskedImage: selectionAreaImage!,
          sourceImage: selectionAreaImage!,
        });
      }
    }
  }
}
