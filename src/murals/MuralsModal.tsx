import {
  chakra,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

export const MuralsModal = chakra(observer(_MuralsModal));

function _MuralsModal({ ...passthrough }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal {...passthrough}>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Murals</ModalHeader>
        <ModalCloseButton />

        <ModalBody></ModalBody>
      </ModalContent>
    </Modal>
  );
}
