import { extendTheme, ThemeOverride } from '@chakra-ui/react';

const override: ThemeOverride = {
  shadows: {
    'md-up':
      '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  zIndices: {
    'mural-background': 100,
    'mural-placed': 110,
    'mural-preview': 120,
    'mural-overlay': 150,
  },
};

export const THEME = extendTheme(override);
