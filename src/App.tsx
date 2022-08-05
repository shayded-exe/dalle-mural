import './App.css';

import { Input } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

import { Dalle } from './dalle';
import { useStore } from './store';

export const App = observer(() => {
  const store = useStore();
  const dalle = new Dalle(store.authToken);

  const [authToken, setAuthToken] = useState('');

  useEffect(() => {
    dalle.authToken = authToken;
  }, [authToken]);

  return (
    <div className='app'>
      <Input
        placeholder='Auth token'
        value={authToken}
        onChange={e => setAuthToken(e.target.value)}
      />
    </div>
  );
});
