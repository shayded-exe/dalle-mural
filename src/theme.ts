import { extendTheme, ThemeOverride } from '@chakra-ui/react';

const override: ThemeOverride = {
  semanticTokens: {
    colors: {
      'transparent-bg': `
        repeating-conic-gradient(
          var(--chakra-colors-blackAlpha-200) 0% 25%,
          transparent 0% 50%
        )
        50% / 2rem 2rem
      `,
    },
  },
  shadows: {
    'window-left': `
      -4px 0 12px -1px rgba(0, 0, 0, 0.08),
      -2px 0 8px -1px rgba(0, 0, 0, 0.04)
    `,
    'window-right': `
      4px 0 12px -1px rgba(0, 0, 0, 0.08),
      2px 0 8px -1px rgba(0, 0, 0, 0.04)
    `,
  },
  zIndices: {
    'mural-background': 100,
    'mural-placed': 110,
    'mural-preview': 120,
    'mural-overlay': 150,
  },
  layerStyles: {
    hoverZoom: {
      transition: 'transform 150ms ease',
      _hover: {
        transform: 'scale(1.1, 1.1)',
      },
    },
  },
  components: {
    Button: {
      sizes: {
        lg: {
          fontSize: 'xl',
        },
      },
      variants: {
        solid: ({ colorScheme }) => ({
          bg: colorScheme === 'gray' ? 'gray.200' : undefined,
        }),
      },
    },
    CloseButton: {
      defaultProps: {
        size: 'lg',
      },
    },
    Modal: {
      baseStyle: {
        closeButton: {
          top: 4,
          insetEnd: 4,
        },
        header: {
          fontSize: '2xl',
        },
        footer: {
          gap: '0.75rem',
        },
      },
    },
    Slider: {
      baseStyle: {
        thumb: {
          boxSize: '1.75rem',
          boxShadow: 'md',
          background: 'gray.100',
        },
      },
    },
    SliderMark: {
      baseStyle: {
        color: 'red',
      },
    },
  },
};

export const THEME = extendTheme(override);
