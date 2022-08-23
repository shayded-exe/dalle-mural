import {
  chakra,
  CloseButton,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  UseModalProps,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { models, useStores } from '../store';
import { CreateMuralButton } from './CreateMuralButton';
import { MuralsGrid } from './MuralsGrid';

export const MuralsModal = chakra(observer(_MuralsModal));

function _MuralsModal({ onClose, ...passthrough }: UseModalProps) {
  const {
    muralStore: { murals, open },
  } = useStores();

  return (
    <Modal
      size={'6xl'}
      onClose={onClose}
      {...passthrough}
    >
      <ModalOverlay />

      <ModalContent
        padding={'1rem'}
        minHeight={'30vh'}
      >
        <ModalHeader
          display={'flex'}
          alignItems={'center'}
        >
          <Heading fontSize={'4xl'}>Murals</Heading>

          <Spacer />

          <CreateMuralButton
            marginRight={'1.5rem'}
            onCreated={onClose}
          />

          <CloseButton onClick={onClose} />
        </ModalHeader>

        <ModalBody
          paddingTop={'1rem'}
          paddingX={'4rem'}
          paddingBottom={'4rem'}
        >
          <MuralsGrid
            murals={murals}
            onSelect={onSelectMural}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );

  function onSelectMural(mural: models.Mural) {
    open(mural.id);
    onClose();
  }
}
