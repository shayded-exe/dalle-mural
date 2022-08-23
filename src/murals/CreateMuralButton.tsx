import { Button, chakra, useDisclosure } from '@chakra-ui/react';
import { CgExtensionAdd } from 'react-icons/cg';

import { CgIcon } from '../components/CgIcon';
import { CreateMuralModal, CreateMuralModalOptions } from './CreateMuralModal';

export const CreateMuralButton = chakra(_CreateMuralButton);

function _CreateMuralButton({ onCreated, ...passthrough }: CreateMuralModalOptions) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        onClick={onOpen}
        leftIcon={<CgIcon as={CgExtensionAdd} />}
        size={'lg'}
        colorScheme={'green'}
        {...passthrough}
      >
        create
      </Button>

      <CreateMuralModal
        isOpen={isOpen}
        onClose={onClose}
        onCreated={onCreated}
        blockScrollOnMount={false}
      />
    </>
  );
}
