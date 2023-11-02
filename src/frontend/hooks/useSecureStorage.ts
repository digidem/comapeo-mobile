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
  }, [key]);

  const setToSecureStore = useCallback(
    (val: string) => {
      setStatus('loading');
      setItemAsync(key, val)
        .then(() => {
          setValue(val);
        })
        .finally(() => {
          setStatus('idle');
        });
    },
    [key],
  );

  return [value, status, setToSecureStore] as const;
}
