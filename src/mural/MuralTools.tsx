import {
  Button,
  ButtonGroup,
  ButtonProps,
  chakra,
  Divider,
  forwardRef,
  VStack,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { IconType } from 'react-icons';
import {
  CgAddR,
  CgColorPicker,
  CgErase,
  CgRedo,
  CgSoftwareDownload,
  CgUndo,
} from 'react-icons/cg';

import { CgIcon } from '../components/CgIcon';
import { useStores } from '../store';
import { UIMode } from '../store/models';
import { downloadImage } from '../utils';

export interface MuralToolsProps {}

export const MuralTools = chakra(observer(_MuralTools));

function _MuralTools({ ...passthrough }: MuralToolsProps) {
  const {
    muralStore: { undo, redo },
    uiStore: { activateMode, rasterize },
  } = useStores();

  return (
    <VStack
      align='stretch'
      {...passthrough}
    >
      <ToolButton
        onClick={() => activateMode(UIMode.Generate)}
        icon={CgAddR}
      >
        generate
      </ToolButton>

      <ToolButton
        onClick={() => activateMode(UIMode.Inpaint)}
        icon={CgColorPicker}
      >
        inpaint
      </ToolButton>

      <ToolButton
        onClick={() => activateMode(UIMode.Erase)}
        icon={CgErase}
      >
        erase
      </ToolButton>

      <ButtonGroup isAttached>
        <ToolButton
          onClick={undo}
          icon={CgUndo}
          size='md'
        >
          undo
        </ToolButton>

        <ToolButton
          onClick={redo}
          icon={CgRedo}
          size='md'
        >
          redo
        </ToolButton>
      </ButtonGroup>

      <Divider />

      <ToolButton
        onClick={onRasterizeClick}
        icon={CgSoftwareDownload}
      >
        download
      </ToolButton>
    </VStack>
  );

  function onRasterizeClick() {
    downloadImage(rasterize());
  }
}

interface ToolButtonProps extends ButtonProps {
  icon: IconType;
}

const ToolButton = forwardRef<ToolButtonProps, 'button'>(
  ({ icon, ...passthrough }, ref) => (
    <Button
      ref={ref}
      leftIcon={<CgIcon as={icon} />}
      size='lg'
      variant='ghost'
      paddingX='0.75rem'
      justifyContent='start'
      {...passthrough}
    >
      {passthrough.children}
    </Button>
  ),
);
