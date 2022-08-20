import { CloseIcon } from '@chakra-ui/icons';
import { chakra, Flex, IconButton, Input, Spinner } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';

import { GenerationHistory } from '../components/GenerationHistory';
import { SuccessfulDalleTask } from '../dalle';
import { useStores } from '../store';
import { ImageBase64 } from '../utils';
import { GeneratePanelContainer } from './GeneratePanelContainer';

export const InpaintPanel = chakra(observer(_InpaintPanel));

function _InpaintPanel({ ...passthrough }: {}) {
  const {
    dalle,
    uiStore: {
      selectionAreaImage,
      selectedGeneration,
      selectGeneration,
      deselectGeneration,
      closePanel,
    },
    inpaintStore: { inpaintHistory, addFromTask },
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
          icon={<CloseIcon />}
          aria-label='Close panel'
        />
      </Flex>

      {isGenerating ? (
        <Spinner size={'xl'} />
      ) : (
        <GenerationHistory
          generations={inpaintHistory}
          promptImage={selectionAreaImage}
          showPromptImage={true}
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

    if (!selectionAreaImage) {
      return;
    }

    setIsGenerating(true);

    try {
      const image = selectionAreaImage.split(',')[1] as ImageBase64;
      const task = (await dalle.generateInpainting({
        prompt,
        maskedImage: image,
        sourceImage: image,
      })) as SuccessfulDalleTask;
      await addFromTask(task);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  }
}
