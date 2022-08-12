import { LockIcon } from '@chakra-ui/icons';
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useRef } from 'react';

import { DALLE_AUTH_TOKEN_LENGTH } from '../dalle';
import { useStores } from '../store';

export const AuthTokenSetting = observer(_AuthTokenSetting);

function _AuthTokenSetting({}: {}) {
  const {
    dalleStore: { isSignedIn, authToken, setAuthToken },
  } = useStores();

  const initFocusRef = useRef<any>();

  const button = (
    <Button
      leftIcon={<LockIcon />}
      colorScheme={isSignedIn ? 'gray' : 'blue'}
    >
      {isSignedIn ? 'auth token' : 'set auth token'}
    </Button>
  );

  return (
    <Popover
      placement={'bottom-start'}
      initialFocusRef={initFocusRef}
    >
      <PopoverTrigger>{button}</PopoverTrigger>
      <PopoverContent>
        <Input
          ref={initFocusRef}
          placeholder='Auth token'
          value={authToken}
          onChange={e => setAuthToken(e.target.value)}
          maxLength={DALLE_AUTH_TOKEN_LENGTH}
          width={`calc(${DALLE_AUTH_TOKEN_LENGTH}ch + 2.5rem)`}
        />
      </PopoverContent>
    </Popover>
  );
}
