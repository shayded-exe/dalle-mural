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
  components: {
    Button: {
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
      },
    },
  },
};

export const THEME = extendTheme(override);
