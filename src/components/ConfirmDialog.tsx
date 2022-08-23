import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  chakra,
  ThemingProps,
} from '@chakra-ui/react';
import { ReactNode, useRef } from 'react';

import { CustomModalProps } from '../utils';

// TODO: Replace with popover
export interface ConfirmDialogProps extends CustomModalProps {
  header: ReactNode;
  body: ReactNode;
  cancelText?: string;
  confirmText?: string;
  confirmButtonStyle?: ThemingProps<'Button'>;
  onConfirm: () => void;
}

export const ConfirmDialog = chakra(_ConfirmDialog);

function _ConfirmDialog({
  header,
  body,
  cancelText,
  confirmText,
  confirmButtonStyle,
  onClose,
  onConfirm,
  ...passthrough
}: ConfirmDialogProps) {
  const cancelRef = useRef(null);

  return (
    <AlertDialog
      onClose={onClose}
      leastDestructiveRef={cancelRef}
      isCentered
      {...passthrough}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader
            fontSize={'xl'}
            fontWeight={'bold'}
            paddingBottom={'0.5rem'}
          >
            {header}
          </AlertDialogHeader>

          <AlertDialogBody fontSize={'lg'}>{body}</AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={onClose}
            >
              {cancelText ?? 'Cancel'}
            </Button>

            <Button
              onClick={() => {
                onClose();
                onConfirm();
              }}
              colorScheme='red'
              {...confirmButtonStyle}
            >
              {confirmText ?? 'Confirm'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
