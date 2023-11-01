import {setItemAsync, getItemAsync} from 'expo-secure-store';
import {useState, useEffect, useCallback} from 'react';

type SecureStoreKey = 'RootKey';

export function useSecureStore(key: SecureStoreKey) {
  const [value, setValue] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading'>('loading');

  useEffect(() => {
    getItemAsync(key)
      .then(storageVal => {
        setValue(storageVal);
      })
      .finally(() => {
        setStatus('idle');
      });
  }, [key, getItemAsync]);

  const setToSecureStore = useCallback(
    (val: string) => {
      setStatus('loading');
      console.log(val);
      setItemAsync(key, val)
        .then(() => {
          setValue(val);
        })
        .catch(err => {
          throw new Error(err);
        })
        .finally(() => {
          setStatus('idle');
        });
    },
    [key, setItemAsync],
  );

  return [value, status, setToSecureStore] as const;
}
