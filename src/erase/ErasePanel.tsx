import { ButtonGroup, chakra, Flex, IconButton } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { CgClose, CgErase, CgShapeCircle, CgShapeSquare, CgUndo } from 'react-icons/cg';

import { BrushShape } from '../canvas';
import { CgIcon } from '../components/CgIcon';
import { useStores } from '../store';
import { EraseBrushSizeSlider } from './EraseBrushSizeSlider';

export const ErasePanel = chakra(observer(_ErasePanel), {
  baseStyle: {
    padding: '0.75rem',
    background: 'white',
    boxShadow: 'lg',
    borderRadius: 'lg',
  },
});

function _ErasePanel({ ...passthrough }: {}) {
  const {
    uiStore: {
      eraseBrushShape,
      setEraseBrushShape,
      eraseBrushScale,
      setEraseBrushScale,
      canPlaceErase,
      placeErase,
      cancelErase,
      closePanel,
    },
  } = useStores();

  const minScale = 1 / 32;
  const maxScale = 1;

  return (
    <Flex
      align={'center'}
      gap={'1.5rem'}
      padding={'1rem'}
      background={'white'}
      boxShadow={'lg'}
      borderRadius={'lg'}
      {...passthrough}
    >
      <ShapeRadioButtons />

      <EraseBrushSizeSlider
        shape={eraseBrushShape}
        value={eraseBrushScale}
        onChange={setEraseBrushScale}
        sliderProps={{
          min: minScale,
          max: maxScale,
          step: minScale,
        }}
      />

      {canPlaceErase ? (
        <ConfirmButtons />
      ) : (
        <IconButton
          onClick={closePanel}
          icon={<CgIcon as={CgClose} />}
          aria-label='close'
        />
      )}
    </Flex>
  );

  function ConfirmButtons() {
    return (
      <Flex gap={'0.75rem'}>
        <IconButton
          onClick={cancelErase}
          icon={<CgIcon as={CgUndo} />}
          aria-label='cancel'
        />

        <IconButton
          onClick={placeErase}
          icon={<CgIcon as={CgErase} />}
          colorScheme={'red'}
          aria-label='erase'
        />
      </Flex>
    );
  }

  function ShapeRadioButtons() {
    return (
      <ButtonGroup isAttached>
        <IconButton
          onClick={() => setEraseBrushShape(BrushShape.Circle)}
          colorScheme={eraseBrushShape === BrushShape.Circle ? 'blue' : undefined}
          icon={<CgIcon as={CgShapeCircle} />}
          aria-label={'circle'}
        />

        <IconButton
          onClick={() => setEraseBrushShape(BrushShape.Rect)}
          colorScheme={eraseBrushShape === BrushShape.Rect ? 'blue' : undefined}
          icon={<CgIcon as={CgShapeSquare} />}
          aria-label={'square'}
        />
      </ButtonGroup>
    );
  }
}
