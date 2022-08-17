import { CloseIcon } from '@chakra-ui/icons';
import { chakra, Flex, IconButton, Input, Spinner } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { FormEvent, useState } from 'react';

import { SuccessfulDalleTask } from '../dalle';
import { useStores } from '../store';
import { GenerationHistory } from './GenerationHistory';

export const GeneratePanel = chakra(observer(_GeneratePanel));

function _GeneratePanel({ ...passthrough }: {}) {
  const {
    dalle,
    uiStore: {
      previewGeneration,
      setPreviewGeneration,
      clearPreviewGeneration,
      closePanel,
    },
    generateStore: { generationHistory, loadTask },
  } = useStores();

  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = async (e: FormEvent) => {
    e.preventDefault();

    setIsGenerating(true);

    const getTask = async () => {
      if (prompt.startsWith('task-')) {
        return await dalle.getTask(prompt);
      } else {
        return await dalle.generate({ prompt });
      }
    };

    try {
      const task = (await getTask()) as SuccessfulDalleTask;
      await loadTask(task);
    } catch (e) {
      console.error(e);
      return;
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Flex
      padding={4}
      minHeight={0}
      background={'white'}
      boxShadow={'lg'}
      borderRadius={'lg'}
      direction={'column'}
      gap={4}
      {...passthrough}
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
}
