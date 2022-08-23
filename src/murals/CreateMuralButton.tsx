import { Button, chakra, useDisclosure } from '@chakra-ui/react';

import { CreateMuralModal } from './CreateMuralModal';

export const CreateMuralButton = chakra(_CreateMuralButton);

function _CreateMuralButton({ ...passthrough }: {}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        onClick={onOpen}
        {...passthrough}
      >
        create mural
      </Button>

      <CreateMuralModal
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}
