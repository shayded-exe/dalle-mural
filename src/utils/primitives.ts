import { ModalProps } from '@chakra-ui/react';
import { Except, Opaque } from 'type-fest';

export type ImageBase64 = Opaque<string, 'ImageBase64'>;
export type ImageDataUrl = Opaque<string, 'ImageDataUrl'>;

export type CustomModalProps = Except<ModalProps, 'children'>;
