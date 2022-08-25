import {
  chakra,
  Flex,
  Slider,
  SliderFilledTrack,
  SliderProps,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/react';
import { CgShapeCircle, CgShapeSquare } from 'react-icons/cg';

import { BrushShape } from '../canvas';
import { CgIcon } from '../components/CgIcon';
import { trapezoidClipPath } from '../utils';

export const EraseBrushSizeSlider = chakra(_EraseBrushSizeSlider);

export function _EraseBrushSizeSlider({
  shape,
  value,
  onChange,
  sliderProps = {},
  ...passthrough
}: {
  shape: BrushShape;
  value: number | undefined;
  onChange: (value: number) => void;
  sliderProps?: SliderProps;
}) {
  const shapeIcon = shape === BrushShape.Rect ? CgShapeSquare : CgShapeCircle;

  return (
    <Flex
      align='center'
      gap='1.25rem'
      {...passthrough}
    >
      <CgIcon
        as={shapeIcon}
        boxSize={'1rem'}
      />

      <Slider
        value={value}
        onChange={onChange}
        focusThumbOnChange={false}
        {...sliderProps}
        minWidth={'10rem'}
      >
        <SliderTrack
          boxSize={'0.75rem'}
          clipPath={trapezoidClipPath({ left: 40 })}
        >
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>

      <CgIcon as={shapeIcon} />
    </Flex>
  );
}
