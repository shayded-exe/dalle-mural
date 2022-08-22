import { chakra, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { Rect } from '../canvas';

export const SelectionInfo = chakra(observer(_SelectionInfo));

function _SelectionInfo({ selection, ...passthrough }: { selection: Rect | null }) {
  return (
    selection && (
      <chakra.div
        fontFamily={'mono'}
        {...passthrough}
      >
        <Text>x: {selection.x}</Text>
        <Text>y: {selection.y}</Text>
      </chakra.div>
    )
  );
}
