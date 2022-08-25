import {
  chakra,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  UseModalProps,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { CgChevronDoubleLeft } from 'react-icons/cg';

import { CgIcon } from '../components/CgIcon';
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
      scrollBehavior={'inside'}
      onClose={onClose}
      {...passthrough}
    >
      <ModalOverlay />

      <ModalContent
        padding={'1rem'}
        minHeight={'30vh'}
        backgroundColor={'background'}
      >
        <ModalHeader
          display={'flex'}
          alignItems={'center'}
        >
          <IconButton
            onClick={onClose}
            icon={<CgIcon as={CgChevronDoubleLeft} />}
            aria-label='back'
          />

          <Heading
            fontSize={'4xl'}
            marginLeft={'1rem'}
          >
            Murals
          </Heading>

          <Spacer />

          <CreateMuralButton onCreated={onClose} />
        </ModalHeader>

        <ModalBody
          paddingTop={'2rem'}
          // paddingX={'4rem'}
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
