import {
  chakra,
  Flex,
  Icon,
  IconButton,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { CgClose, CgShapeSquare } from 'react-icons/cg';

import { useStores } from '../store';
import { getTrapezoidClipPath } from '../utils';

export const ErasePanel = chakra(observer(_ErasePanel));

function _ErasePanel({ ...passthrough }: {}) {
  const {
    uiStore: { selectionAreaScale, setSelectionAreaScale, closePanel },
  } = useStores();

  const minScale = 1 / 16;
  const maxScale = 1;

  return (
    <Flex
      direction={'row'}
      align={'center'}
      gap={'1.25rem'}
      padding={'1rem'}
      background={'white'}
      boxShadow={'lg'}
      borderRadius={'lg'}
      {...passthrough}
    >
      <Icon
        as={CgShapeSquare}
        boxSize={'1rem'}
      />

      <Slider
        value={selectionAreaScale}
        onChange={setSelectionAreaScale}
        focusThumbOnChange={false}
        min={minScale}
        max={maxScale}
        step={minScale}
        minWidth={'10rem'}
      >
        <SliderTrack
          boxSize={'0.75rem'}
          clipPath={getTrapezoidClipPath({
            left: 40,
          })}
        >
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb boxSize={'1.5rem'} />
      </Slider>

      <Icon
        as={CgShapeSquare}
        boxSize={'1.5rem'}
      />

      <IconButton
        onClick={closePanel}
        icon={
          <Icon
            as={CgClose}
            boxSize={'1.5rem'}
          />
        }
        aria-label='Close panel'
      />
    </Flex>
  );
}
