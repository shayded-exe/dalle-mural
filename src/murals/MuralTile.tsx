import {
  Box,
  chakra,
  Flex,
  Heading,
  IconButton,
  Spacer,
  useDisclosure,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { CgSoftwareDownload, CgTrash } from 'react-icons/cg';

import { CgIcon } from '../components/CgIcon';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { FavoriteButton } from '../components/FavoriteButton';
import { GenerationImage } from '../generate/GenerationImage';
import { models, useStores } from '../store';

export const MuralTile = chakra(observer(_MuralTile));

function _MuralTile({
  mural,
  onSelect,
  ...passthrough
}: {
  mural: models.Mural;
  onSelect?: () => void;
}) {
  const {
    muralStore: { setIsFavorite, delete: _delete },
  } = useStores();

  const confirmDelete = useDisclosure();

  return (
    <>
      <Box
        background={'white'}
        borderWidth={'1px'}
        borderRadius={'lg'}
        boxShadow={'md'}
        layerStyle={'hoverZoom'}
        {...passthrough}
      >
        <Heading
          size={'md'}
          fontWeight={'semibold'}
          padding={'0.75rem'}
        >
          {mural.name}
        </Heading>

        <GenerationImage
          onClick={onSelect}
          image={mural.previewImage}
          borderTopWidth={'1px'}
          borderBottomWidth={'1px'}
          cursor={'pointer'}
        />

        <Flex padding={'0.5rem'}>
          <IconButton
            onClick={confirmDelete.onOpen}
            icon={<CgIcon as={CgTrash} />}
            variant={'ghost'}
            aria-label={'delete'}
          />

          <Spacer />

          {/* decide if full res will be stored or if rasterization will be needed */}
          <IconButton
            icon={<CgIcon as={CgSoftwareDownload} />}
            variant={'ghost'}
            aria-label={'download'}
          />

          <FavoriteButton
            isFavorite={mural.isFavorite}
            onIsFavoriteChange={value => setIsFavorite(mural.id, value)}
          />
        </Flex>
      </Box>

      <ConfirmDialog
        header={'Delete mural'}
        body={`Are you sure? This can't be undone.`}
        isOpen={confirmDelete.isOpen}
        onClose={confirmDelete.onClose}
        onConfirm={() => _delete(mural.id)}
        blockScrollOnMount={false}
      />
    </>
  );
}
