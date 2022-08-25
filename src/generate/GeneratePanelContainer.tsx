import { chakra, Flex } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';

export const GeneratePanelContainer = chakra(observer(_GeneratePanelContainer));

function _GeneratePanelContainer({
  children,
  ...passthrough
}: {
  children: ReactNode;
}) {
  return (
    <Flex
      direction={'column'}
      gap={'1rem'}
      {...passthrough}
    >
      <Flex>{children}</Flex>
    </Flex>
  );
}
