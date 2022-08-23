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

export const CreateMuralModal = chakra(observer(_CreateMuralModal));

function _CreateMuralModal({
  ...passthrough
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal {...passthrough}>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Create Mural</ModalHeader>
        <ModalCloseButton />

        <ModalBody></ModalBody>
      </ModalContent>
    </Modal>
  );
}
