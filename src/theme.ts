import { extendTheme, ThemeOverride } from '@chakra-ui/react';

const override: ThemeOverride = {
  shadows: {
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
};

export const THEME = extendTheme(override);
