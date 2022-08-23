import { Button, chakra, useDisclosure } from '@chakra-ui/react';

import { MuralsModal } from './MuralsModal';

export const OpenMuralsButton = chakra(_OpenMuralsButton);

function _OpenMuralsButton({ ...passthrough }: {}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        onClick={onOpen}
        {...passthrough}
      >
        murals
      </Button>

      <MuralsModal
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}
