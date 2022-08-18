import { chakra, forwardRef, HTMLChakraProps } from '@chakra-ui/react';
import { getValidChildren } from '@chakra-ui/react-utils';
import { cloneElement, ReactElement, ReactNode } from 'react';

export interface ZStackProps extends HTMLChakraProps<'div'> {
  children: ReactNode;
}

export const ZStack = forwardRef<ZStackProps, 'div'>(
  ({ children, ...passthrough }, ref) => {
    const validChildren = getValidChildren(children);

    return (
      <chakra.div
        ref={ref}
        position={'relative'}
        {...passthrough}
      >
        {validChildren.map(child => cloneElement(child, getChildProps(child)))}
      </chakra.div>
    );

    function getChildProps(child: ReactElement) {
      return {
        style: {
          position: 'absolute',
          inset: 0,
          ...child.props.style,
        },
        width: passthrough.width,
        height: passthrough.height,
      };
    }
  },
);
