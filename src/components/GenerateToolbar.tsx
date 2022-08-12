import { Button, chakra, Flex } from '@chakra-ui/react';

export const GenerateToolbar = chakra(_GenerateToolbar);

function _GenerateToolbar({ ...passthrough }: {}) {
  return (
    <Flex
      pointerEvents={'none'}
      sx={{
        '& button': {
          pointerEvents: 'auto',
        },
      }}
      gap={8}
      {...passthrough}
    >
      <Button
        size={'lg'}
        width={40}
        colorScheme={'blue'}
      >
        Generate
      </Button>
      <Button
        size={'lg'}
        width={40}
        colorScheme={'green'}
      >
        Inpaint
      </Button>
    </Flex>
  );
}
