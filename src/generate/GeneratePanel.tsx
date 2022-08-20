import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { Button, chakra, Flex, IconButton, Input, Spinner } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { FormEvent, useState } from 'react';

import { GenerationHistory } from '../components/GenerationHistory';
import { SuccessfulDalleTask } from '../dalle';
import { useStores } from '../store';

export const GeneratePanel = chakra(observer(_GeneratePanel));

function _GeneratePanel({ ...passthrough }: {}) {
  const {
    dalle,
    uiStore: {
      previewGeneration,
      setPreviewGeneration,
      clearPreviewGeneration,
      closePanel,
      canPlaceGeneration,
      placeGeneration,
    },
    generateStore: { generationHistory, loadTask },
  } = useStores();

  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const confirmPlaceButton = (
    <Button
      onClick={placeGeneration}
      rightIcon={<CheckIcon />}
      colorScheme={'green'}
      alignSelf={'end'}
      boxShadow={'md'}
    >
      Place
    </Button>
  );

  const mainPanel = (
    <Flex
      direction={'column'}
      gap={4}
      padding={4}
      minHeight={0}
      background={'white'}
      boxShadow={'lg'}
      borderRadius={'lg'}
    >
      <Flex gap={4}>
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
          selectedGeneration={previewGeneration}
          select={setPreviewGeneration}
          deselect={clearPreviewGeneration}
          maxHeight={'20rem'}
        />
      )}
    </Flex>
  );

  return (
    <Flex
      direction={'column'}
      gap={4}
      {...passthrough}
    >
      {canPlaceGeneration && confirmPlaceButton}
      {mainPanel}
    </Flex>
  );

  async function generate(e: FormEvent) {
    e.preventDefault();

    setIsGenerating(true);

    try {
      const task = (await getTask()) as SuccessfulDalleTask;
      await loadTask(task);
    } catch (e) {
      console.error(e);
      return;
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
