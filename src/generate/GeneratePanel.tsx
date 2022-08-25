import {
  Button,
  chakra,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Switch,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { CgClose } from 'react-icons/cg';

import { CgIcon } from '../components/CgIcon';
import { useStores } from '../store';
import { GenerateMode } from '../store/models';
import { GenerationHistory } from './GenerationHistory';
import { GenerationImage } from './GenerationImage';

export const GeneratePanel = chakra(observer(_GeneratePanel));

function _GeneratePanel({ ...passthrough }: {}) {
  const {
    dalleStore: { dalle, generationTasks, inpaintingTasks, addTask },
    uiStore: {
      isInpaintMode,
      setGenerateMode,
      selectedGeneration,
      selectGeneration,
      deselectGeneration,
      selectionAreaImage,
      closePanel,
    },
  } = useStores();

  const tasks = isInpaintMode ? inpaintingTasks : generationTasks;

  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <Flex
      padding={'1rem'}
      background={'white'}
      boxShadow={'lg'}
      borderRadius={'lg'}
      direction={'column'}
      gap={'1rem'}
      {...passthrough}
    >
      <HStack spacing='1rem'>
        <chakra.form
          onSubmit={generate}
          flexGrow='1'
          display='flex'
        >
          <Input
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder='Use your imagination 🌈'
            borderRightRadius='0'
          />

          <Button
            isLoading={isGenerating}
            type='submit'
            colorScheme='blue'
            borderLeftRadius='0'
            flexShrink={0}
          >
            generate
          </Button>
        </chakra.form>

        <IconButton
          onClick={closePanel}
          icon={<CgIcon as={CgClose} />}
          aria-label='close'
        />
      </HStack>

      <FormControl
        display='flex'
        alignItems='center'
        paddingLeft='1rem'
      >
        <FormLabel
          fontSize='2xl'
          fontWeight='bold'
          marginBottom='0'
          cursor='pointer'
        >
          Inpaint
        </FormLabel>

        <Switch
          isChecked={isInpaintMode}
          onChange={toggleGenerateMode}
          size='lg'
        />

        <GenerationImage
          image={selectionAreaImage}
          onClick={toggleGenerateMode}
          cursor='pointer'
          opacity={isInpaintMode ? 1 : 0.5}
          minWidth='64px'
          minHeight='64px'
          maxWidth='64px'
          maxHeight='64px'
          marginLeft='2rem'
        />
      </FormControl>

      <GenerationHistory
        isLoading={isGenerating}
        tasks={tasks}
        selectedGeneration={selectedGeneration}
        select={selectGeneration}
        deselect={deselectGeneration}
        minHeight={'20rem'}
      />
    </Flex>
  );

  function toggleGenerateMode() {
    setGenerateMode(isInpaintMode ? GenerateMode.Generate : GenerateMode.Inpaint);
  }

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
      } else if (isInpaintMode) {
        return await dalle.generateInpainting({
          prompt,
          maskedImage: selectionAreaImage!,
          sourceImage: selectionAreaImage!,
        });
      } else {
        return await dalle.generate({ prompt });
      }
    }
  }
}
