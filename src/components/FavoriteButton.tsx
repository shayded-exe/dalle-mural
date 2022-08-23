import { chakra, Icon, IconButton } from '@chakra-ui/react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

export const FavoriteButton = chakra(_FavoriteButton);

function _FavoriteButton({
  isFavorite,
  onIsFavoriteChange,
  ...passthrough
}: {
  isFavorite: boolean;
  onIsFavoriteChange: (isFavorite: boolean) => void;
}) {
  return (
    <IconButton
      onClick={() => onIsFavoriteChange(!isFavorite)}
      icon={
        <Icon
          as={isFavorite ? FaHeart : FaRegHeart}
          color={isFavorite ? 'red' : undefined}
        />
      }
      variant={'ghost'}
      aria-label={'heart'}
      {...passthrough}
    ></IconButton>
  );
}
