import {
  Button,
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useForm } from 'react-hook-form';

import { models, useStores } from '../store';
import { MuralOptions } from '../store/models';
import { CustomModalProps } from '../utils';

export interface CreateMuralModalOptions {
  onCreated?: (mural: models.Mural) => void;
}

export interface CreateMuralModalProps
  extends CreateMuralModalOptions,
    CustomModalProps {}

export const CreateMuralModal = chakra(observer(_CreateMuralModal));

function _CreateMuralModal({
  onCreated,
  onClose,
  ...passthrough
}: CreateMuralModalProps) {
  const {
    muralStore: { createAndOpen },
  } = useStores();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
  } = useForm<MuralOptions>({
    defaultValues: {
      name: 'Untitled Masterpiece',
      widthSquares: 3,
      heightSquares: 3,
      overlapRatio: 1 / 8,
    },
  });

  return (
    <Modal
      size={'lg'}
      onClose={onClose}
      {...passthrough}
    >
      <ModalOverlay />

      <ModalContent marginTop={'8rem'}>
        <ModalHeader>Create Mural</ModalHeader>
        <ModalCloseButton />

        <ModalBody paddingX={'2rem'}>
          <chakra.form
            id='create-mural-form'
            onSubmit={handleSubmit(onSubmit)}
            display={'flex'}
            flexDirection={'column'}
            gap={'1rem'}
          >
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>Name</FormLabel>
              <Input
                {...register('name', {
                  required: 'Name is required',
                })}
              />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>

            <Flex gap={'1rem'}>
              <FormControl
                isInvalid={!!errors.widthSquares}
                maxWidth={'max-content'}
              >
                <FormLabel>Width (tiles)</FormLabel>
                <NumberInput
                  {...register('widthSquares', {
                    required: 'Width is required',
                  })}
                  onChange={(_, v) => setValue('widthSquares', v)}
                  min={1}
                  max={9}
                  maxWidth={'10ch'}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>{errors.widthSquares?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.heightSquares}>
                <FormLabel>Height (tiles)</FormLabel>

                <NumberInput
                  {...register('heightSquares', {
                    required: 'Height is required',
                  })}
                  onChange={(_, v) => setValue('heightSquares', v)}
                  min={1}
                  max={9}
                  maxWidth={'10ch'}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>

                <FormErrorMessage>{errors.heightSquares?.message}</FormErrorMessage>
              </FormControl>
            </Flex>

            <FormControl
              isInvalid={!!errors.overlapRatio}
              paddingX={'0.5rem'}
              paddingBottom={'1.5rem'}
            >
              <FormLabel>Tile overlap</FormLabel>
              <Slider
                {...register('overlapRatio', { required: true })}
                onChange={v => setValue('overlapRatio', v)}
                min={0}
                max={3 / 4}
                step={1 / 8}
                // idk why this isn't set by register
                defaultValue={1 / 8}
                focusThumbOnChange={false}
              >
                {['0', '1/8', '3/8', '5/8', '3/4'].map(value => (
                  <SliderMark
                    key={value}
                    value={eval(value)}
                    marginTop={'0.75rem'}
                    transform={'translateX(-50%)'}
                    fontSize={'sm'}
                  >
                    {value}
                  </SliderMark>
                ))}

                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>

                <SliderThumb />
              </Slider>
            </FormControl>
          </chakra.form>
        </ModalBody>

        <ModalFooter>
          <Button
            onClick={onClose}
            disabled={isSubmitting}
            variant={'ghost'}
          >
            cancel
          </Button>
          <Button
            type='submit'
            form={'create-mural-form'}
            isLoading={isSubmitting}
            colorScheme={'green'}
          >
            create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  function onSubmit(data: MuralOptions) {
    const mural = createAndOpen(data);
    onCreated?.(mural);
    onClose();
  }
}
